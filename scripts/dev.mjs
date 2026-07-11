#!/usr/bin/env node
/**
 * Dev runner. Avoids `tsx`, whose bundled esbuild fails to spawn its worker on
 * Node 26 (`spawn UNKNOWN`). Instead it uses the toolchain that works on current
 * Node: tsc for the server (compile to dist/), esbuild for the client bundle,
 * and `node --watch` to run and auto-restart the compiled server.
 *
 * Binaries are invoked through their JS entry points with the current `node`,
 * so it works whether launched via `npm run dev` or `node scripts/dev.mjs`.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const node = process.execPath;
const root = fileURLToPath(new URL("..", import.meta.url));
const bin = (rel) => fileURLToPath(new URL(`../node_modules/${rel}`, import.meta.url));

const TSC = bin("typescript/bin/tsc");
const ESBUILD = bin("esbuild/bin/esbuild");
const CLIENT_ARGS = [
  "src/client/main.ts",
  "--bundle",
  "--sourcemap",
  "--target=es2018",
  "--outfile=public/js/bundle.js",
];
// Lite bundle (header/menus only) used by legal + error pages.
const CLIENT_LITE_ARGS = [
  "src/client/main-lite.ts",
  "--bundle",
  "--sourcemap",
  "--target=es2018",
  "--outfile=public/js/bundle-lite.js",
];

const children = [];

function once(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(node, args, { stdio: "inherit", cwd: root });
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`exited with ${code}`)),
    );
  });
}

function watch(args) {
  const p = spawn(node, args, { stdio: "inherit", cwd: root });
  children.push(p);
  p.on("exit", () => {
    shutdown();
    process.exit(1);
  });
}

function shutdown() {
  for (const c of children) {
    if (!c.killed) c.kill();
  }
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

// Initial build so the server and bundle exist before the watchers start.
console.log("[dev] building…");
await once([TSC, "-p", "tsconfig.json"]);
await once([ESBUILD, ...CLIENT_ARGS]);
await once([ESBUILD, ...CLIENT_LITE_ARGS]);

// Watch: recompile the server, rebundle the client, and restart the server.
console.log("[dev] watching for changes (Ctrl+C to stop)…");
// `--watch=forever` keeps esbuild running even when stdin is closed (e.g. when
// dev is launched non-interactively); in a normal terminal it behaves the same.
watch([TSC, "-p", "tsconfig.json", "--watch", "--preserveWatchOutput"]);
watch([ESBUILD, ...CLIENT_ARGS, "--watch=forever"]);
watch([ESBUILD, ...CLIENT_LITE_ARGS, "--watch=forever"]);
watch(["--watch", "dist/server.js"]);
