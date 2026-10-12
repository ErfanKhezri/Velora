const KEY = "velora-theme";

export function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0d0a1c" : "#faf7ff");
  localStorage.setItem(KEY, dark ? "dark" : "light");
}

/** Follow the system theme until the user picks one. */
export function watchSystemTheme() {
  const media = matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", (e) => {
    if (localStorage.getItem(KEY)) return;
    document.documentElement.classList.toggle("dark", e.matches);
  });
}
