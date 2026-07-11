"use strict";
(() => {
  // src/client/nav.ts
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header || !document.querySelector(".hero")) return;
    const THRESHOLD = 40;
    const update = () => {
      header.classList.toggle("is-transparent", window.scrollY < THRESHOLD);
    };
    update();
    requestAnimationFrame(() => header.classList.add("is-ready"));
    window.addEventListener("scroll", update, { passive: true });
  }
  function initFaq() {
    const toggles = document.querySelectorAll("[data-faq-toggle]");
    toggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest("[data-faq-item]");
        if (!item) return;
        const isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }
  function initNavDropdown() {
    const item = document.querySelector(".nav__item--menu");
    const trigger = item == null ? void 0 : item.querySelector(".nav__trigger");
    if (!item || !trigger) return;
    const set = (open) => {
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    };
    trigger.addEventListener("click", () => set(!item.classList.contains("is-open")));
    item.addEventListener("mouseenter", () => set(true));
    item.addEventListener("mouseleave", () => set(false));
    item.addEventListener("focusin", () => set(true));
    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget)) set(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && item.classList.contains("is-open")) {
        set(false);
        if (item.contains(document.activeElement)) trigger.focus();
      }
    });
  }
  function initMobileMenu() {
    const btn = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-menu]");
    const header = document.querySelector(".site-header");
    if (!btn || !panel) return;
    const set = (open) => {
      panel.classList.toggle("is-open", open);
      btn.classList.toggle("is-open", open);
      header == null ? void 0 : header.classList.toggle("is-menu-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    btn.addEventListener("click", () => set(!panel.classList.contains("is-open")));
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) set(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        set(false);
        btn.focus();
      }
    });
  }

  // src/client/main-lite.ts
  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initFaq();
    initNavDropdown();
    initMobileMenu();
  });
})();
//# sourceMappingURL=bundle-lite.js.map
