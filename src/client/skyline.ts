/**
 * Procedural night-skyline for the hero, drawn on <canvas> — no library.
 * Three parallax building layers + stars + moon, with warm gold windows that
 * twinkle and beacon lights that pulse. Layers drift slowly, follow the mouse
 * a little, and sink at different speeds as you scroll (2.5D depth).
 *
 * Perf notes: building bodies + unlit windows are pre-rendered once per layer
 * to an offscreen canvas; each frame only blits those and re-draws the small
 * set of lit windows/beacons. The loop pauses when the hero leaves the
 * viewport or the tab is hidden. Honors prefers-reduced-motion (static frame).
 */

type Window = { x: number; y: number; w: number; h: number; phase: number; speed: number; warm: boolean };
type Beacon = { x: number; y: number; phase: number };
type Star = { x: number; y: number; r: number; phase: number; speed: number };

type Layer = {
  /** Pre-rendered silhouette + unlit windows. */
  base: HTMLCanvasElement;
  width: number;
  lit: Window[];
  beacons: Beacon[];
  drift: number; // px per second
  mouseShift: number; // max horizontal px from mouse parallax
  scrollShift: number; // fraction of scrollY applied as vertical sink
};

/** Deterministic PRNG so the skyline looks the same on every visit. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOLD = "233, 196, 106";
const PALE = "203, 213, 225";

function buildLayer(
  rand: () => number,
  viewW: number,
  viewH: number,
  opts: {
    color: string;
    minH: number; // fractions of viewH
    maxH: number;
    minW: number; // px at dpr 1
    maxW: number;
    windows: boolean;
    windowLitChance: number;
    antennaChance: number;
    drift: number;
    mouseShift: number;
    scrollShift: number;
  },
): Layer {
  const width = Math.ceil(viewW + 320); // overscan so the wrap seam is offscreen
  const base = document.createElement("canvas");
  base.width = width;
  base.height = viewH;
  const ctx = base.getContext("2d")!;
  ctx.fillStyle = opts.color;

  const lit: Window[] = [];
  const beacons: Beacon[] = [];

  let x = -rand() * 60;
  while (x < width) {
    const w = opts.minW + rand() * (opts.maxW - opts.minW);
    const h = (opts.minH + rand() * (opts.maxH - opts.minH)) * viewH;
    const top = viewH - h;

    // Main body
    ctx.fillRect(x, top, w, h);

    // Occasional stepped setback for an art-deco silhouette
    if (h > viewH * 0.34 && rand() < 0.55) {
      const inset = w * (0.18 + rand() * 0.14);
      const capH = h * (0.1 + rand() * 0.12);
      ctx.fillRect(x + inset, top - capH, w - inset * 2, capH);
      if (rand() < 0.5) {
        const inset2 = inset + w * 0.14;
        ctx.fillRect(x + inset2, top - capH * 1.7, w - inset2 * 2, capH * 0.7);
      }
    }

    // Antenna + pulsing beacon on the tallest towers
    if (h > viewH * 0.4 && rand() < opts.antennaChance) {
      const ax = x + w / 2;
      const ah = 14 + rand() * 26;
      ctx.fillRect(ax - 1, top - ah, 2, ah);
      beacons.push({ x: ax, y: top - ah - 2, phase: rand() * Math.PI * 2 });
    }

    // Windows: dark ones baked into the base; lit ones animated per-frame
    if (opts.windows) {
      const margin = Math.max(3, w * 0.12);
      const cell = 7 + rand() * 3; // window grid cell
      const cols = Math.max(1, Math.floor((w - margin * 2) / cell));
      const rows = Math.max(2, Math.floor((h - 14) / (cell + 2)));
      const winW = Math.max(1.6, cell * 0.42);
      const winH = Math.max(2.2, cell * 0.58);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (rand() < 0.42) continue; // skip — walls, not glass, dominate
          const wx = x + margin + c * cell + (cell - winW) / 2;
          const wy = top + 10 + r * (cell + 2);
          if (rand() < opts.windowLitChance) {
            lit.push({
              x: wx, y: wy, w: winW, h: winH,
              phase: rand() * Math.PI * 2,
              speed: 0.3 + rand() * 0.8,
              warm: rand() < 0.85,
            });
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            ctx.fillRect(wx, wy, winW, winH);
            ctx.fillStyle = opts.color;
          }
        }
      }
    }

    x += w + 2 + rand() * 16;
  }

  return { base, width, lit, beacons, drift: opts.drift, mouseShift: opts.mouseShift, scrollShift: opts.scrollShift };
}

export function initSkyline(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-skyline]");
  const hero = canvas?.closest<HTMLElement>(".hero");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let layers: Layer[] = [];
  let stars: Star[] = [];
  let viewW = 0;
  let viewH = 0;
  let dpr = 1;
  let raf = 0;
  let running = false;
  let inView = true;
  let start = performance.now();

  // Mouse parallax target/current, lerped for weight
  let mouseX = 0;
  let mouseCur = 0;

  function rebuild(): void {
    const rect = hero!.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = Math.max(1, Math.round(rect.width));
    viewH = Math.max(1, Math.round(rect.height));
    canvas!.width = Math.round(viewW * dpr);
    canvas!.height = Math.round(viewH * dpr);
    canvas!.style.width = viewW + "px";
    canvas!.style.height = viewH + "px";

    const rand = mulberry32(20260705); // fixed seed — same skyline every visit
    const dense = viewW > 700;

    // Far → near: silhouettes get darker and taller as they approach (dusk haze)
    layers = [
      buildLayer(rand, viewW, viewH, {
        color: "#1b2540", minH: 0.16, maxH: 0.34, minW: 34, maxW: 70,
        windows: false, windowLitChance: 0, antennaChance: 0.12,
        drift: 2.4, mouseShift: 8, scrollShift: 0.05,
      }),
      buildLayer(rand, viewW, viewH, {
        color: "#131c31", minH: 0.22, maxH: 0.46, minW: 44, maxW: 96,
        windows: dense, windowLitChance: 0.16, antennaChance: 0.2,
        drift: 5.2, mouseShift: 18, scrollShift: 0.1,
      }),
      buildLayer(rand, viewW, viewH, {
        color: "#0a1120", minH: 0.3, maxH: 0.58, minW: 56, maxW: 128,
        windows: true, windowLitChance: 0.2, antennaChance: 0.3,
        drift: 9.5, mouseShift: 32, scrollShift: 0.16,
      }),
    ];

    stars = [];
    const starRand = mulberry32(7);
    const count = Math.round(viewW / 14);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: starRand() * viewW,
        y: starRand() * viewH * 0.5,
        r: 0.5 + starRand() * 1.1,
        phase: starRand() * Math.PI * 2,
        speed: 0.2 + starRand() * 0.6,
      });
    }
  }

  function drawSky(): void {
    const g = ctx!.createLinearGradient(0, 0, 0, viewH);
    g.addColorStop(0, "#0a0f1c");
    g.addColorStop(0.55, "#0d1526");
    g.addColorStop(1, "#131e35");
    ctx!.fillStyle = g;
    ctx!.fillRect(0, 0, viewW, viewH);

    // Warm haze rising from the city
    const glow = ctx!.createRadialGradient(viewW * 0.5, viewH * 1.05, 40, viewW * 0.5, viewH * 1.05, viewH * 0.9);
    glow.addColorStop(0, `rgba(${GOLD}, 0.16)`);
    glow.addColorStop(0.55, `rgba(${GOLD}, 0.05)`);
    glow.addColorStop(1, "rgba(233,196,106,0)");
    ctx!.fillStyle = glow;
    ctx!.fillRect(0, 0, viewW, viewH);
  }

  function drawMoon(t: number): void {
    const mx = viewW * 0.78;
    const my = viewH * 0.2;
    const pulse = 0.9 + 0.1 * Math.sin(t * 0.4);
    const halo = ctx!.createRadialGradient(mx, my, 4, mx, my, 70);
    halo.addColorStop(0, `rgba(245, 217, 155, ${0.22 * pulse})`);
    halo.addColorStop(1, "rgba(245,217,155,0)");
    ctx!.fillStyle = halo;
    ctx!.beginPath();
    ctx!.arc(mx, my, 70, 0, Math.PI * 2);
    ctx!.fill();
    // Soft-shaded full moon
    const disc = ctx!.createRadialGradient(mx - 4, my - 4, 1, mx, my, 12);
    disc.addColorStop(0, "rgba(250, 240, 214, 0.98)");
    disc.addColorStop(1, "rgba(233, 208, 152, 0.85)");
    ctx!.fillStyle = disc;
    ctx!.beginPath();
    ctx!.arc(mx, my, 12, 0, Math.PI * 2);
    ctx!.fill();
  }

  function frame(now: number): void {
    const t = (now - start) / 1000;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawSky();

    // Stars twinkle gently
    for (const s of stars) {
      const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx!.fillStyle = `rgba(226, 232, 240, ${a.toFixed(3)})`;
      ctx!.fillRect(s.x, s.y, s.r, s.r);
    }

    drawMoon(t);

    mouseCur += (mouseX - mouseCur) * 0.04; // heavy, cinematic lag
    const scrollY = window.scrollY;

    for (const layer of layers) {
      const offset = ((t * layer.drift) % layer.width + layer.width) % layer.width;
      const px = mouseCur * layer.mouseShift;
      const py = Math.min(scrollY, viewH) * layer.scrollShift;

      ctx!.save();
      ctx!.translate(Math.round(px), Math.round(py));
      ctx!.drawImage(layer.base, -offset, 0);
      ctx!.drawImage(layer.base, layer.width - offset, 0);

      // Lit windows — the only per-frame geometry
      for (const w of layer.lit) {
        const a = 0.28 + 0.5 * (0.5 + 0.5 * Math.sin(t * w.speed + w.phase));
        ctx!.fillStyle = `rgba(${w.warm ? GOLD : PALE}, ${a.toFixed(3)})`;
        const wx = w.x - offset;
        ctx!.fillRect(wx, w.y, w.w, w.h);
        ctx!.fillRect(wx + layer.width, w.y, w.w, w.h);
      }

      // Beacons pulse slowly
      for (const b of layer.beacons) {
        const a = 0.35 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + b.phase));
        ctx!.fillStyle = `rgba(${GOLD}, ${a.toFixed(3)})`;
        const bx = b.x - offset;
        ctx!.beginPath();
        ctx!.arc(bx, b.y, 2, 0, Math.PI * 2);
        ctx!.arc(bx + layer.width, b.y, 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    if (running) raf = requestAnimationFrame(frame);
  }

  function play(): void {
    if (running || reduced) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function pause(): void {
    running = false;
    cancelAnimationFrame(raf);
  }

  rebuild();

  if (reduced) {
    // One static frame — no motion, same art direction
    frame(start + 4000);
    return;
  }

  play();

  // Pause offscreen / hidden tab
  new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      if (inView && !document.hidden) play();
      else pause();
    },
    { threshold: 0.02 },
  ).observe(hero);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (inView) play();
  });

  // Mouse parallax (-1 … 1 from hero center)
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  });
  hero.addEventListener("mouseleave", () => {
    mouseX = 0;
  });

  // Rebuild on resize (debounced)
  let timer = 0;
  new ResizeObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      rebuild();
      if (reduced) frame(start + 4000);
    }, 150);
  }).observe(hero);
}
