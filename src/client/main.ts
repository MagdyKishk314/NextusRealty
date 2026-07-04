/**
 * Client-side enhancements: plain TypeScript, bundled by esbuild.
 * Everything here is progressive: the FAQ and lead form both work without JS.
 */

const CHECK_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-11"/></svg>';

function initHeader(): void {
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

function initFaq(): void {
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

function showSuccess(form: HTMLFormElement): void {
  const card = form.closest<HTMLElement>(".lead__card");
  if (!card) return;
  card.innerHTML = `
    <div class="form-success">
      <span class="form-success__icon">${CHECK_SVG}</span>
      <h3>You&rsquo;re on the list</h3>
      <p>A market specialist will reach out shortly to line up your first sample of exclusive leads.</p>
    </div>`;
}

function initLeadForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-lead-form]");
  if (!form) return;

  const errorEl = form.querySelector<HTMLElement>("[data-lead-error]");
  const submitBtn = form.querySelector<HTMLButtonElement>("[data-lead-submit]");
  const originalBtn = submitBtn ? submitBtn.innerHTML : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (errorEl) {
      errorEl.classList.add("is-hidden");
      errorEl.textContent = "";
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      const params = new URLSearchParams();
      new FormData(form).forEach((value, key) => params.append(key, String(value)));

      const res = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "fetch",
          Accept: "application/json",
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Something went wrong.");
      }

      showSuccess(form);
    } catch (err) {
      if (errorEl) {
        errorEl.textContent =
          err instanceof Error ? err.message : "Something went wrong.";
        errorEl.classList.remove("is-hidden");
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtn;
      }
    }
  });
}

function initPostForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-post-form]");
  if (!form) return;

  // --- Cover image: live preview + drag & drop ---
  const uploader = form.querySelector<HTMLElement>("[data-uploader]");
  const fileInput = form.querySelector<HTMLInputElement>("[data-file]");
  const hint = form.querySelector<HTMLElement>("[data-hint]");
  const preview = form.querySelector<HTMLElement>("[data-preview]");
  const previewImg = form.querySelector<HTMLImageElement>("[data-preview-img]");
  const previewName = form.querySelector<HTMLElement>("[data-preview-name]");
  const clearBtn = form.querySelector<HTMLButtonElement>("[data-clear]");

  if (uploader && fileInput && hint && preview && previewImg && previewName && clearBtn) {
    let objectUrl: string | null = null;

    const showFile = (file: File) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      previewImg.src = objectUrl;
      previewName.textContent = file.name;
      hint.hidden = true;
      preview.hidden = false;
      clearBtn.hidden = false;
    };

    const reset = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = null;
      fileInput.value = "";
      hint.hidden = false;
      preview.hidden = true;
      clearBtn.hidden = true;
    };

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) showFile(file);
      else reset();
    });

    clearBtn.addEventListener("click", reset);

    ["dragenter", "dragover"].forEach((evt) =>
      uploader.addEventListener(evt, (e) => {
        e.preventDefault();
        uploader.classList.add("is-dragover");
      }),
    );
    ["dragleave", "dragend", "drop"].forEach((evt) =>
      uploader.addEventListener(evt, () => uploader.classList.remove("is-dragover")),
    );
    uploader.addEventListener("drop", (e) => {
      e.preventDefault();
      const dt = (e as DragEvent).dataTransfer;
      const file = dt?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        fileInput.files = dt!.files;
        showFile(file);
      }
    });
  }

  // --- Category quick-pick chips ---
  const category = form.querySelector<HTMLInputElement>("[data-category]");
  if (category) {
    form.querySelectorAll<HTMLButtonElement>(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        category.value = chip.dataset.chip ?? "";
        category.focus();
      });
    });
  }

  // --- Excerpt character counter ---
  const excerpt = form.querySelector<HTMLTextAreaElement>("[data-excerpt]");
  const counter = form.querySelector<HTMLElement>("[data-excerpt-count]");
  if (excerpt && counter) {
    const IDEAL = 160;
    const update = () => {
      const n = excerpt.value.length;
      counter.textContent = `${n} characters${n > IDEAL ? ` — ${IDEAL} or fewer reads best in search` : ""}`;
      counter.classList.toggle("is-over", n > IDEAL);
    };
    excerpt.addEventListener("input", update);
    update();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initFaq();
  initLeadForm();
  initPostForm();
});
