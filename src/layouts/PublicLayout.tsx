import { motion } from "motion/react";
import { CalendarHeart, House, Sparkles } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router";
import { InstagramIcon } from "../components/BrandIcons";
import { DemoBanner } from "../components/DemoBanner";
import { LiveBackground } from "../components/LiveBackground";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { SALON } from "../lib/constants";
import { cn } from "../lib/cn";

const links = [
  { to: "/", label: "خانه", icon: House, end: true },
  { to: "/book", label: "رزرو نوبت", icon: Sparkles },
  { to: "/my", label: "نوبت‌های من", icon: CalendarHeart },
];

export function PublicLayout() {
  const { pathname } = useLocation();
  const isBooking = pathname === "/book";

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[70] focus:rounded-xl focus:bg-surface focus:px-4 focus:py-2">
        رفتن به محتوای اصلی
      </a>
      <LiveBackground />
      <DemoBanner />
      <header className="sticky top-0 z-30 glass-thin border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="منوی اصلی">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn("relative rounded-full px-4 py-2 text-sm font-medium transition-colors", isActive ? "text-fg" : "text-muted hover:text-fg")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-elevated" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />}
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      {!isBooking && (
        <footer className="border-t border-line/60 pb-28 md:pb-0">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
            <Logo />
            <p>© ۱۴۰۵ سالن زیبایی ولورا — ساخته‌شده با عشق برای زیبایی شما</p>
            <a href={SALON.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
              <InstagramIcon className="size-4" />
              <span dir="ltr">@velora.salon</span>
            </a>
          </div>
        </footer>
      )}

      <nav
        aria-label="منوی پایین"
        className={cn(
          "glass fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 rounded-full md:hidden",
          isBooking && "hidden",
        )}
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn("relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors", isActive ? "text-fg" : "text-muted")}
            >
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="bottom-pill" className="absolute top-1.5 h-8 w-14 rounded-full bg-white/70 shadow-sm dark:bg-white/15" />}
                  <link.icon className="relative size-5" strokeWidth={isActive ? 2.2 : 1.7} aria-hidden />
                  <span className="relative">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
