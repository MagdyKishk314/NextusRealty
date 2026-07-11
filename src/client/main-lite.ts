/**
 * Lite bundle for content-only pages (legal, error): header + menus + FAQ,
 * with no GSAP, loader, motion, or page transitions. Pages using this bundle
 * dismiss the boot/transition veil via the pure-CSS fallback animation.
 */

import { initHeader, initFaq, initNavDropdown, initMobileMenu } from "./nav";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initFaq();
  initNavDropdown();
  initMobileMenu();
});
