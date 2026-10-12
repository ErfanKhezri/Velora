import { motion } from "motion/react";
import { CalendarCheck2, ChevronLeft, ChevronRight, Hourglass, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";
import { Tabs } from "../../components/ui/Tabs";
import { useAppointments } from "../../hooks/useAppointments";
import { useStaff, useWorkingHours } from "../../hooks/useStaff";
import { dayjs, formatDay, formatPrice, jalali, startOfWeek, toDateKey, toFa, today } from "../../lib/date";
import { cn } from "../../lib/cn";
import { AppointmentSheet } from "./calendar/AppointmentSheet";
import { DayView } from "./calendar/DayView";
import { NewAppointmentModal } from "./calendar/NewAppointmentModal";
import { WeekView } from "./calendar/WeekView";

type View = "day" | "week";

export default function Calendar() {
  const [date, setDate] = useState(today());
  const [view, setView] = useState<View>("day");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [mobileStaffId, setMobileStaffId] = useState<string | null>(null);

  const from = view === "day" ? date : toDateKey(startOfWeek(date));
  const to = toDateKey(dayjs(from).add(view === "day" ? 1 : 7, "day"));
  const appointments = useAppointments(from, to);
  const staff = useStaff();
  const workingHours = useWorkingHours();

  const activeStaff = staff.data?.filter((s) => s.active) ?? [];
  const list = appointments.data ?? [];
  const live = list.filter((a) => a.status !== "cancelled");
  const pending = list.filter((a) => a.status === "pending").length;
  const revenue = live.reduce((sum, a) => sum + a.service.price, 0);
  const selected = list.find((a) => a.id === selectedId);

  function move(step: number) {
    setDate(toDateKey(dayjs(date).add(step * (view === "day" ? 1 : 7), "day")));
  }

  const rangeLabel =
    view === "day"
      ? formatDay(date)
      : `${toFa(jalali(from).format("D MMMM"))} تا ${toFa(jalali(dayjs(to).subtract(1, "day")).format("D MMMM"))}`;

  const stats = [
    { label: view === "day" ? "نوبت‌های روز" : "نوبت‌های هفته", value: toFa(live.length), icon: CalendarCheck2 },
    { label: "در انتظار تأیید", value: toFa(pending), icon: Hourglass },
    { label: "درآمد پیش‌بینی‌شده", value: formatPrice(revenue), icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">تقویم نوبت‌ها</h1>
          <p className="mt-1 text-sm text-muted">نوبت‌های رزروشده در سایت بلافاصله اینجا نمایش داده می‌شوند</p>
        </div>
        <Button variant="accent" onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden />
          نوبت جدید
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-champagne-100 text-blush-600 dark:from-white/10 dark:to-white/5 dark:text-champagne-300">
                <s.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-muted">{s.label}</p>
                {appointments.isPending ? <Skeleton className="mt-1 h-6 w-20" /> : <p className="mt-0.5 text-xl font-bold">{s.value}</p>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="w-9 px-0" onClick={() => move(-1)} aria-label="قبلی">
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setDate(today())}>
            امروز
          </Button>
          <Button variant="secondary" size="sm" className="w-9 px-0" onClick={() => move(1)} aria-label="بعدی">
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className={cn("ms-2 font-semibold transition-opacity", appointments.isPlaceholderData && "opacity-50")} aria-live="polite">
            {rangeLabel}
          </h2>
        </div>
        <Tabs
          value={view}
          onChange={setView}
          tabs={[
            { id: "day", label: "روز" },
            { id: "week", label: "هفته" },
          ]}
        />
      </div>

      {view === "day" && activeStaff.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:hidden" role="tablist" aria-label="کارکنان">
          {activeStaff.map((s) => {
            const isActive = (mobileStaffId ?? activeStaff[0].id) === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setMobileStaffId(s.id)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "border-transparent bg-primary text-primary-fg" : "border-line text-muted",
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      )}

      {!appointments.data || !staff.data || !workingHours.data ? (
        <Skeleton className="h-[60dvh]" />
      ) : view === "day" ? (
        <DayView
          date={date}
          staff={activeStaff}
          workingHours={workingHours.data}
          appointments={list}
          mobileStaffId={mobileStaffId ?? activeStaff[0]?.id}
          onSelect={setSelectedId}
        />
      ) : (
        <WeekView
          weekStart={from}
          appointments={list}
          onSelect={setSelectedId}
          onOpenDay={(d) => {
            setDate(d);
            setView("day");
          }}
        />
      )}

      <AppointmentSheet appointment={selected} onClose={() => setSelectedId(null)} onRescheduled={setDate} />
      <NewAppointmentModal open={creating} onClose={() => setCreating(false)} onCreated={setDate} />
    </div>
  );
}
