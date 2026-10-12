import { AnimatePresence, motion } from "motion/react";
import { CalendarHeart, CalendarX2, Clock3, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { AppointmentDetails } from "../api";
import { PhoneLogin } from "../components/PhoneLogin";
import { StatusBadge } from "../components/ui/Badge";
import { Button, buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { Tabs } from "../components/ui/Tabs";
import { useToast } from "../components/ui/Toast";
import { useCancelMyAppointment, useMyAppointments } from "../hooks/useAppointments";
import { useAuth } from "../lib/auth";
import { dayjs, formatClock, formatDay, formatPrice, jalali, toFa } from "../lib/date";

type Tab = "upcoming" | "past";

export default function MyAppointments() {
  const { customer, logoutCustomer } = useAuth();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [cancelling, setCancelling] = useState<AppointmentDetails | null>(null);
  const { data } = useMyAppointments(customer?.id);
  const cancel = useCancelMyAppointment();
  const toast = useToast();

  if (!customer) {
    return (
      <section className="mx-auto max-w-md px-4 py-12 sm:py-20">
        <Card className="p-6 sm:p-8">
          <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-champagne-100 text-blush-600 dark:from-white/10 dark:to-white/5 dark:text-champagne-300">
            <CalendarHeart className="size-6" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold">نوبت‌های من</h1>
          <p className="mt-2 mb-6 text-sm leading-7 text-muted">برای دیدن نوبت‌هایتان با شماره موبایل وارد شوید.</p>
          <PhoneLogin />
        </Card>
      </section>
    );
  }

  const now = dayjs();
  const isUpcoming = (a: AppointmentDetails) => dayjs(a.startsAt).isAfter(now) && (a.status === "pending" || a.status === "confirmed");
  const upcoming = data?.filter(isUpcoming) ?? [];
  const past = (data?.filter((a) => !isUpcoming(a)) ?? []).reverse();
  const list = tab === "upcoming" ? upcoming : past;

  async function confirmCancel() {
    await cancel.mutateAsync(cancelling!.id);
    setCancelling(null);
    toast("نوبت لغو شد");
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">نوبت‌های من</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <UserRound className="size-4" aria-hidden />
            {customer.name} · <span dir="ltr">{toFa(customer.phone)}</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={logoutCustomer}>
          <LogOut className="size-4" aria-hidden />
          خروج
        </Button>
      </div>

      <Tabs
        className="mt-8 w-full sm:w-auto"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "upcoming", label: `پیش‌رو${data ? ` (${toFa(upcoming.length)})` : ""}` },
          { id: "past", label: "گذشته و لغوشده" },
        ]}
      />

      <div className="mt-6 space-y-3">
        {!data ? (
          Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-28" />)
        ) : list.length === 0 ? (
          <Card>
            <EmptyState
              icon={tab === "upcoming" ? CalendarHeart : CalendarX2}
              title={tab === "upcoming" ? "نوبت پیش‌رویی ندارید" : "هنوز سابقه‌ای ندارید"}
              text={tab === "upcoming" ? "وقتش رسیده کمی به خودتان برسید. اولین نوبتتان را همین حالا رزرو کنید." : undefined}
              action={
                tab === "upcoming" && (
                  <Link to="/book" className={buttonStyles("accent")}>
                    رزرو نوبت
                  </Link>
                )
              }
            />
          </Card>
        ) : (
          <AnimatePresence initial={false}>
            {list.map((a, i) => {
              const j = jalali(a.startsAt);
              return (
                <motion.div key={a.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="grid w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-blush-100 to-champagne-100 py-2 text-plum-800 dark:from-white/10 dark:to-white/5 dark:text-cream">
                      <span className="text-2xl leading-tight font-bold">{toFa(j.date())}</span>
                      <span className="text-xs">{j.format("MMMM")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{a.service.name}</h2>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted">با {a.staff.name}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="size-3.5" aria-hidden />
                          {formatDay(a.startsAt)}، ساعت {formatClock(a.startsAt)}
                        </span>
                        <span>{formatPrice(a.service.price)}</span>
                      </p>
                    </div>
                    {tab === "upcoming" && (
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setCancelling(a)}>
                        لغو
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <ConfirmDialog
        open={!!cancelling}
        title="لغو نوبت"
        text={cancelling ? `نوبت «${cancelling.service.name}» در ${formatDay(cancelling.startsAt)} ساعت ${formatClock(cancelling.startsAt)} لغو شود؟` : ""}
        confirmLabel="بله، لغو شود"
        loading={cancel.isPending}
        onConfirm={confirmCancel}
        onClose={() => setCancelling(null)}
      />
    </section>
  );
}
