import { GithubIcon } from "./BrandIcons";
import { SALON } from "../lib/constants";

export function DemoBanner() {
  return (
    <div className="pt-safe relative z-40 bg-gradient-to-l from-iris-600 via-orchid-500 to-iris-600 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-1.5 text-center text-xs">
        <span className="text-white/90">نسخه نمایشی — داده‌ها فقط در مرورگر شما ذخیره می‌شوند</span>
        <a
          href={SALON.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-white underline-offset-4 hover:underline"
        >
          <GithubIcon className="size-3.5" />
          <span>گیت‌هاب</span>
        </a>
      </div>
    </div>
  );
}
