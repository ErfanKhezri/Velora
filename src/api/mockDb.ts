import { createSeed } from "./seed";
import type { Db } from "./types";

const KEY = "velora-db";

export function readDb(): Db {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
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
