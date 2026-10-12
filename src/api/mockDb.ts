import { createSeed, SEED_VERSION } from "./seed";
import type { Db } from "./types";

const KEY = "velora-db";

export function readDb(): Db {
  const raw = localStorage.getItem(KEY);
  const stored: Db | null = raw ? JSON.parse(raw) : null;
  if (stored?.version === SEED_VERSION) return stored;
  const seed = createSeed();
  writeDb(seed);
  return seed;
}

export function writeDb(db: Db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetDb() {
  writeDb(createSeed());
}

/** Fake network latency so loading states are visible. */
export function delay() {
  return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Calls `callback` when another tab changes the data. */
export function onExternalChange(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
