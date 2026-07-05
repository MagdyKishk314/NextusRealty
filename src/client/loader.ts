/**
 * First-visit loading screen: the gold brand mark pulsing over ink with a thin
 * gold progress bar, lifting away (same upward curtain as page transitions)
 * once the page has fully loaded. Shows once per session — later arrivals use
 * the between-page transition instead.
 *
 * The inline <head> script stamps `.is-booting` on <html> before first paint
 * (pure-CSS cover), and this module swaps in the real loader at DOMContentLoaded.
 *
 * `loaderDone` resolves when the reveal starts — the hero entrance waits on it
 * so the title cascades in just as the curtain lifts.
 */

import { gsap } from "gsap";

let resolveDone: (() => void) | null = null;
export const loaderDone = new Promise<void>((r) => (resolveDone = r));

function done(): void {
  resolveDone?.();
  resolveDone = null;
}

export function initLoader(): void {
  const root = document.documentElement;
  if (!root.classList.contains("is-booting")) {
    done(); // no loader this visit — hero entrance may start immediately
    return;
  }

  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML =
    '<div class="page-loader__inner">' +
    '<span class="page-veil__mark">N</span>' +
    '<span class="page-loader__bar"><span class="page-loader__fill"></span></span>' +
    "</div>";
  document.body.appendChild(loader);

  const inner = loader.querySelector<HTMLElement>(".page-loader__inner")!;
  const mark = loader.querySelector<HTMLElement>(".page-veil__mark")!;
  const fill = loader.querySelector<HTMLElement>(".page-loader__fill")!;

  // Real loader has taken over from the boot cover; lock scroll while it runs.
  root.classList.remove("is-booting");
  root.classList.add("nx-lock");

  gsap.set(fill, { scaleX: 0 });
  const crawl = gsap.to(fill, { scaleX: 0.78, duration: 2.4, ease: "power2.out" });
  const pulse = gsap.fromTo(
    mark,
    { scale: 0.96 },
    { scale: 1.06, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 },
  );

  const loaded = new Promise<void>((r) => {
    if (document.readyState === "complete") r();
    else window.addEventListener("load", () => r(), { once: true });
  });
  const minShow = new Promise<void>((r) => setTimeout(r, 900)); // never just blink
  const safety = new Promise<void>((r) => setTimeout(r, 5000)); // reveal even if an asset hangs

  Promise.race([Promise.all([loaded, minShow]), safety]).then(() => {
    crawl.kill();
    pulse.kill();
    gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      .to(fill, { scaleX: 1, duration: 0.3, ease: "power2.inOut" })
      .to(inner, { autoAlpha: 0, scale: 0.92, duration: 0.28, ease: "power2.in" }, ">-0.05")
      .to(loader, { yPercent: -100, duration: 0.65, onStart: done }, ">-0.12")
      .add(() => {
        root.classList.remove("nx-lock");
        loader.remove();
      });
  });
}
