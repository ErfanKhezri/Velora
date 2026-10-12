export const isTauri = "__TAURI_INTERNALS__" in window;
export const isStandalone =
  matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
