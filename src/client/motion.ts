/**
 * GSAP-driven motion: hero entrance, scroll-triggered reveals, stat count-ups
 * and 2.5D parallax. Everything is progressive - without JS (or with reduced
 * motion) the page renders fully visible and static.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loaderDone } from "./loader";

/** Wrap each word of an element in a span (preserving child elements like the
 *  accent span) so the title can cascade in word by word. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];

  const wrapTextNode = (node: Node): void => {
    const frag = document.createDocumentFragment();
    for (const part of (node.textContent ?? "").split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(document.createTextNode(" "));
      } else {
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = part;
        frag.append(s);
        words.push(s);
      }
    }
    (node as ChildNode).replaceWith(frag);
  };

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) wrapTextNode(child);
    else if (child instanceof HTMLElement) {
      for (const inner of Array.from(child.childNodes)) {
        if (inner.nodeType === Node.TEXT_NODE) wrapTextNode(inner);
      }
    }
  }
  return words;
}

function heroIntro(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;

  const title = hero.querySelector<HTMLElement>(".hero__title");
  const words = title ? splitWords(title) : [];
  const items = hero.querySelectorAll<HTMLElement>("[data-hero-el]");

  // Paused until the loading screen (if any) starts lifting, so the title
  // cascades in right as the curtain rises.
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  if (words.length) {
    tl.from(words, { y: "0.6em", autoAlpha: 0, duration: 0.7, stagger: 0.05 }, 0.15);
  }
  tl.from(items, { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 0.4);

  loaderDone.then(() => tl.play());

  // Content drifts up slower than the page scrolls and fades for a little depth.
  const inner = hero.querySelector<HTMLElement>(".hero__inner");
  if (inner) {
    gsap.to(inner, {
      y: 110,
      autoAlpha: 0.15,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }
}

/** Count stat values up when they scroll into view. Handles mixed strings
 *  like "3.4×", "<6h", "100%": prefix/suffix are kept, the number animates. */
function statCounters(): void {
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const raw = (el.textContent ?? "").trim();
    const m = raw.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!m) return;
    const [, prefix, num, suffix] = m;
    const target = parseFloat(num!);
    const decimals = num!.includes(".") ? num!.split(".")[1]!.length : 0;

    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.6,
      ease: "power1.inOut",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${state.v.toFixed(decimals)}${suffix}`;
      },
      onComplete: () => {
        el.textContent = raw; // restore exact original ("3.4×", not "3.4×" reformatted)
      },
    });
  });
}

/** Deterministically reveal whatever is already on screen - used after the
 *  loading screen (which may land on an anchor mid-page), where waiting for a
 *  scroll event would leave the section invisible. */
function revealInView(): void {
  const vh = window.innerHeight;
  const inView = (el: HTMLElement): boolean => {
    const r = el.getBoundingClientRect();
    return r.top < vh * 0.95 && r.bottom > 0;
  };

  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(inView);
  if (els.length) {
    gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power2.out", stagger: 0.09, overwrite: true });
  }
  document.querySelectorAll<HTMLElement>("[data-reveal-rows]").forEach((table) => {
    if (!inView(table)) return;
    gsap.to(table.querySelectorAll(".compare__row"), {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.055,
      overwrite: true,
    });
  });
}

function reveals(): void {
  // Generic fade-up. Batched so siblings entering together stagger naturally.
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  if (els.length) {
    gsap.set(els, { y: 30, autoAlpha: 0 });
    ScrollTrigger.batch(els, {
      start: "top 86%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power2.out", stagger: 0.09 }),
    });
  }

  // Comparison table: rows cascade in one after another
  document.querySelectorAll<HTMLElement>("[data-reveal-rows]").forEach((table) => {
    const rows = table.querySelectorAll<HTMLElement>(".compare__row");
    gsap.set(rows, { autoAlpha: 0, y: 14 });
    gsap.to(rows, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.055,
      scrollTrigger: { trigger: table, start: "top 82%", once: true },
    });
  });
}

export function initMotion(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);
  heroIntro();
  statCounters();
  reveals();

  // The loading screen may land the visitor mid-page (anchor URLs like
  // /#comparison). Recompute trigger positions once it's done and reveal
  // anything already in view instead of waiting for a scroll event.
  loaderDone.then(() => {
    ScrollTrigger.refresh();
    revealInView();
  });
}
