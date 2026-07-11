/**
 * Header behaviors shared by every page (and by the GSAP-free lite bundle):
 * transparent-over-hero handling, the Leads dropdown (with aria-expanded
 * state), the mobile menu, and the FAQ accordion. Zero dependencies.
 */

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>(".site-header");
  // Only pages with a hero get the transparent-over-hero treatment; elsewhere
  // the header stays solid (its CSS default).
  if (!header || !document.querySelector(".hero")) return;

  const THRESHOLD = 40;
  const update = () => {
    header.classList.toggle("is-transparent", window.scrollY < THRESHOLD);
  };
  update(); // set the initial state before enabling transitions (no flash)
  requestAnimationFrame(() => header.classList.add("is-ready"));
  window.addEventListener("scroll", update, { passive: true });
}

export function initFaq(): void {
  const toggles = document.querySelectorAll<HTMLButtonElement>("[data-faq-toggle]");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest<HTMLElement>("[data-faq-item]");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

/** Leads dropdown: mirror the CSS hover behavior into aria-expanded, and add
 *  click/Escape support so it works for keyboard and touch users. */
export function initNavDropdown(): void {
  const item = document.querySelector<HTMLElement>(".nav__item--menu");
  const trigger = item?.querySelector<HTMLButtonElement>(".nav__trigger");
  if (!item || !trigger) return;

  const set = (open: boolean): void => {
    item.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  };

  trigger.addEventListener("click", () => set(!item.classList.contains("is-open")));
  item.addEventListener("mouseenter", () => set(true));
  item.addEventListener("mouseleave", () => set(false));
  item.addEventListener("focusin", () => set(true));
  item.addEventListener("focusout", (e) => {
    if (!item.contains(e.relatedTarget as Node)) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && item.classList.contains("is-open")) {
      set(false);
      if (item.contains(document.activeElement)) trigger.focus();
    }
  });
}

/** Mobile menu: burger toggles the panel; closes on link click and Escape. */
export function initMobileMenu(): void {
  const btn = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!btn || !panel) return;

  const set = (open: boolean): void => {
    panel.classList.toggle("is-open", open);
    btn.classList.toggle("is-open", open);
    // Force the header solid while the menu is open: the expanding panel
    // pushes the hero down, and a transparent header over the white body
    // would leave the white X and brand text invisible.
    header?.classList.toggle("is-menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  btn.addEventListener("click", () => set(!panel.classList.contains("is-open")));
  panel.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a")) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) {
      set(false);
      btn.focus(); // hand focus back to the toggle for keyboard users
    }
  });
}
