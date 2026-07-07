/**
 * Between-page transition: a full-screen ink curtain with the gold brand mark
 * sweeps up over the outgoing page, and lifts away on the incoming one - a
 * single continuous upward wipe across the navigation.
 *
 * Flash-proofing: right before navigating we set a sessionStorage flag; a tiny
 * inline script in <head> reads it and stamps `.is-veiled` on <html> *before
 * first paint*, so the new page arrives already covered (pure CSS boot cover).
 * This module then swaps in the real veil and animates the reveal. Pages that
 * carry the boot cover but not this bundle (e.g. admin login) self-dismiss via
 * a CSS fallback animation.
 */

import { gsap } from "gsap";
import { assetsReady } from "./assets";

const FLAG = "nx:pt";

function flag(action: "get" | "set" | "clear"): string | null {
  try {
    if (action === "set") sessionStorage.setItem(FLAG, "1");
    else if (action === "clear") sessionStorage.removeItem(FLAG);
    else return sessionStorage.getItem(FLAG);
  } catch {
    /* storage unavailable (private mode etc.) - transitions still work, just without the boot cover */
  }
  return null;
}

function buildVeil(): HTMLElement {
  const veil = document.createElement("div");
  veil.className = "page-veil";
  veil.setAttribute("aria-hidden", "true");
  veil.innerHTML = '<span class="page-veil__mark">N</span>';
  document.body.appendChild(veil);
  return veil;
}

/** Should this anchor navigate with a transition? */
function transitionalUrl(a: HTMLAnchorElement): URL | null {
  const href = a.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (a.target === "_blank" || a.hasAttribute("download")) return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return null;
  // Same-page hash jump - let smooth scroll handle it
  if (url.pathname === location.pathname && url.search === location.search && url.hash) return null;
  return url;
}

export function initPageTransitions(): void {
  const arrived = flag("get");
  flag("clear");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.remove("is-veiled");
    return;
  }

  const veil = buildVeil();
  const mark = veil.querySelector<HTMLElement>(".page-veil__mark")!;
  let navigating = false;

  // ---- Entrance: lift the curtain the previous page left behind
  if (arrived) {
    gsap.set(veil, { autoAlpha: 1, yPercent: 0 });
    gsap.set(mark, { autoAlpha: 1 });
    // Boot cover (html::before/::after) hands off to the real veil seamlessly
    document.documentElement.classList.remove("is-veiled");
    // Hold the curtain until the new page's assets have loaded, pulsing the
    // mark so it never looks frozen; then wipe it away.
    const pulse = gsap.to(mark, { scale: 1.07, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const minShow = new Promise<void>((r) => setTimeout(r, 350));
    const safety = new Promise<void>((r) => setTimeout(r, 15000));
    Promise.race([Promise.all([assetsReady(), minShow]), safety]).then(() => {
      pulse.kill();
      gsap.set(mark, { scale: 1 });
      gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(mark, { autoAlpha: 0, scale: 0.88, duration: 0.28, ease: "power2.in" }, 0)
        .to(veil, { yPercent: -100, duration: 0.6 }, 0.16)
        .set(veil, { autoAlpha: 0, yPercent: 0 });
    });
  } else {
    document.documentElement.classList.remove("is-veiled");
    gsap.set(veil, { autoAlpha: 0 });
  }

  // ---- bfcache restore: never leave the page covered
  window.addEventListener("pageshow", (e) => {
    if ((e as PageTransitionEvent).persisted) {
      navigating = false;
      document.documentElement.classList.remove("is-veiled");
      gsap.killTweensOf([veil, mark]);
      gsap.set(veil, { autoAlpha: 0, yPercent: 0 });
    }
  });

  // ---- Exit: cover the page, then navigate
  document.addEventListener("click", (e) => {
    if (navigating) {
      e.preventDefault();
      return;
    }
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.("a");
    if (!a) return;
    const url = transitionalUrl(a);
    if (!url) return;

    e.preventDefault();
    navigating = true;
    flag("set");

    gsap.set(veil, { yPercent: 100, autoAlpha: 1 });
    gsap.set(mark, { autoAlpha: 0, scale: 0.85 });
    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          location.href = url.href;
        },
      })
      .to(veil, { yPercent: 0, duration: 0.42 })
      .to(mark, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0.2);
  });
}
