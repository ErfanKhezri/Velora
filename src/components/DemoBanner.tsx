import { GithubIcon } from "./BrandIcons";
import { SALON } from "../lib/constants";

export function DemoBanner() {
  return (
    <div className="pt-safe relative z-40 bg-gradient-to-l from-plum-800 via-plum-700 to-plum-800 text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-1.5 text-center text-xs">
        <span className="text-cream/85">نسخه نمایشی — داده‌ها فقط در مرورگر شما ذخیره می‌شوند</span>
        <a
          href={SALON.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-champagne-200 hover:text-champagne-100"
        >
          <GithubIcon className="size-3.5" />
          <span>گیت‌هاب</span>
        </a>
      </div>
    </div>
  );
}
