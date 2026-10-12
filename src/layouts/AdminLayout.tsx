import { motion } from "motion/react";
import { CalendarDays, ExternalLink, LogOut, Scissors, Settings, Users } from "lucide-react";
import { Suspense } from "react";
import { Link, Navigate, NavLink, Outlet } from "react-router";
import { DemoBanner } from "../components/DemoBanner";
import { Logo } from "../components/Logo";
import { PageLoader } from "../components/PageLoader";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../lib/auth";
import { cn } from "../lib/cn";

const links = [
  { to: "/admin", label: "تقویم", icon: CalendarDays, end: true },
  { to: "/admin/services", label: "خدمات", icon: Scissors },
  { to: "/admin/staff", label: "کارکنان", icon: Users },
  { to: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth();
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBanner />
      <div className="flex flex-1">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-line bg-surface/60 p-5 lg:flex">
          <Logo to="/admin" />
          <p className="mt-1 ps-12 text-xs text-muted">پنل مدیریت</p>
          <nav className="mt-10 flex flex-col gap-1" aria-label="منوی مدیریت">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn("relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors", isActive ? "text-primary-fg" : "text-muted hover:bg-elevated hover:text-fg")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-2xl bg-primary shadow-soft" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />}
                    <link.icon className="relative size-5" aria-hidden />
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-1">
            <Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-elevated hover:text-fg">
              <ExternalLink className="size-5" aria-hidden />
              مشاهده سایت
            </Link>
            <button type="button" onClick={logoutAdmin} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-elevated hover:text-fg">
              <LogOut className="size-5" aria-hidden />
              خروج
            </button>
            <div className="px-2 pt-3">
              <ThemeToggle />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/85 px-4 backdrop-blur-xl lg:hidden">
            <Logo to="/admin" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button type="button" onClick={logoutAdmin} aria-label="خروج" className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-surface">
                <LogOut className="size-[18px]" />
              </button>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-8 lg:pb-10">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      <nav aria-label="منوی مدیریت" className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 backdrop-blur-xl lg:hidden">
        <div className="grid h-16 grid-cols-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium", isActive ? "text-blush-600 dark:text-champagne-300" : "text-muted")}
            >
              <link.icon className="size-5" aria-hidden />
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
