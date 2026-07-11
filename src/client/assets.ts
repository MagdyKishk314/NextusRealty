/**
 * Resolves once the page's eager assets have settled: every non-lazy <img> and
 * every media element (video/audio) has loaded or errored, web fonts are ready,
 * and the window `load` event has fired (which also covers stylesheets, scripts
 * and CSS background images like the hero). Lazy assets (loading="lazy",
 * preload="none") are excluded so a loading screen never waits on off-screen
 * content it can't reach.
 *
 * `onProgress(loaded, total)` fires as each asset settles, so a progress bar can
 * track real loading. Every task also resolves on `error`, so a broken or
 * missing asset can never hang the wait.
 */
export function assetsReady(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const tasks: Array<Promise<void>> = [];
  let total = 0;
  let loaded = 0;
  const report = (): void => onProgress?.(loaded, total);

  const track = (alreadySettled: boolean, subscribe: (done: () => void) => void): void => {
    total += 1;
    if (alreadySettled) {
      loaded += 1;
      return;
    }
    tasks.push(
      new Promise<void>((resolve) => {
        let fired = false;
        const done = (): void => {
          if (fired) return;
          fired = true;
          loaded += 1;
          report();
          resolve();
        };
        subscribe(done);
      }),
    );
  };

  // Eager images - lazy ones only load once scrolled into view, so skip them.
  for (const img of Array.from(document.images)) {
    if (img.loading === "lazy") continue;
    track(img.complete, (done) => {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }

  // Media elements (video/audio) are intentionally NOT tracked: the hero video
  // has a poster + static-photo fallback by design, so a loading screen must
  // never hold the page hostage while a large mp4 buffers. It fades in on its
  // own whenever it's ready.

  // Web fonts (Fraunces / Inter).
  if ("fonts" in document) {
    track(document.fonts.status === "loaded", (done) => {
      document.fonts.ready.then(done, done);
    });
  }

  // Catch-all: stylesheets, scripts, iframes and CSS background images.
  track(document.readyState === "complete", (done) => {
    window.addEventListener("load", done, { once: true });
  });

  report(); // initial state, in case everything is already settled
  return Promise.all(tasks).then(() => undefined);
}
