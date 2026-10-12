import { motion } from "motion/react";
import { CalendarCheck2, CalendarPlus, Check, RotateCcw } from "lucide-react";
import { Link } from "react-router";
import type { AppointmentDetails } from "../../api";
import { Button, buttonStyles } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { formatClock, formatDay, formatPrice } from "../../lib/date";
import { downloadIcs } from "../../lib/ics";

export function StepDone({ appointment, onRestart }: { appointment: AppointmentDetails; onRestart: () => void }) {
  const rows = [
    ["خدمت", appointment.service.name],
    ["متخصص", appointment.staff.name],
    ["تاریخ", formatDay(appointment.startsAt)],
    ["ساعت", formatClock(appointment.startsAt)],
    ["مبلغ", formatPrice(appointment.service.price)],
  ];

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="relative mx-auto mb-6 grid size-24 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-blush-200/70 dark:bg-champagne-300/20"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.25, 1], opacity: [0, 1, 0.6] }}
          transition={{ duration: 0.9 }}
        />
        <motion.span
          className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-champagne-400 text-white shadow-glow"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.15, bounce: 0.5 }}
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.span>
      </div>

      <p className="leading-8 text-muted">
        {appointment.customer.name} عزیز، نوبت شما ثبت شد و پس از تأیید سالن قطعی می‌شود.
      </p>

      <dl className="mt-6 divide-y divide-dashed divide-line rounded-3xl border border-line bg-elevated/50 px-5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-3">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between py-3">
          <dt className="text-muted">وضعیت</dt>
          <dd>
            <StatusBadge status={appointment.status} />
          </dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button variant="secondary" onClick={() => downloadIcs(appointment)}>
          <CalendarPlus className="size-4" aria-hidden />
          افزودن به تقویم
        </Button>
        <Link to="/my" className={buttonStyles("primary")}>
          <CalendarCheck2 className="size-4" aria-hidden />
          نوبت‌های من
        </Link>
      </div>
      <Button variant="ghost" className="mt-2" onClick={onRestart}>
        <RotateCcw className="size-4" aria-hidden />
        رزرو نوبت دیگر
      </Button>
    </div>
  );
}
