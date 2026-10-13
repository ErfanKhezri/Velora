import { CalendarClock, Check, CheckCheck, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AppointmentDetails, AppointmentStatus, Slot } from "../../../api";
import { Avatar } from "../../../components/ui/Avatar";
import { StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Input";
import { Sheet } from "../../../components/ui/Modal";
import { useToast } from "../../../components/ui/Toast";
import { useRescheduleAppointment, useUpdateAppointment } from "../../../hooks/useAppointments";
import { formatClock, formatDay, formatDuration, formatPrice, toDateKey, toFa } from "../../../lib/date";
import { STATUS_LABEL } from "../../../lib/constants";
import { SlotPicker } from "./SlotPicker";

type Props = {
  appointment: AppointmentDetails | undefined;
  onClose: () => void;
  onRescheduled: (date: string) => void;
};

export function AppointmentSheet({ appointment, onClose, onRescheduled }: Props) {
  const [note, setNote] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const update = useUpdateAppointment();
  const reschedule = useRescheduleAppointment();
  const toast = useToast();

  const id = appointment?.id;
  useEffect(() => {
    setNote(appointment?.note ?? "");
    setRescheduling(false);
    setSlot(null);
    setDate(appointment ? toDateKey(appointment.startsAt) : null);
    // Reset the local form only when a different appointment opens.
  }, [id]);

  async function setStatus(status: AppointmentStatus) {
    await update.mutateAsync({ id: appointment!.id, status });
    toast(`وضعیت به «${STATUS_LABEL[status]}» تغییر کرد`);
  }

  async function saveNote() {
    await update.mutateAsync({ id: appointment!.id, note: note.trim() });
    toast("یادداشت ذخیره شد");
  }

  async function saveReschedule() {
    try {
      await reschedule.mutateAsync({ id: appointment!.id, date: date!, startMin: slot!.startMin });
      toast("زمان نوبت تغییر کرد");
      setRescheduling(false);
      onRescheduled(date!);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  const a = appointment;
  const active = a && (a.status === "pending" || a.status === "confirmed");

  return (
    <Sheet open={!!a} onClose={onClose} title="جزئیات نوبت">
      {a && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-orchid-100 via-mist to-iris-100 p-5 dark:from-night-700 dark:via-night-800 dark:to-night-900">
            <StatusBadge status={a.status} />
            <h3 className="mt-3 text-xl font-bold">{a.service.name}</h3>
            <p className="mt-1 text-sm text-muted">
              {formatDay(a.startsAt)} · {formatClock(a.startsAt)} تا {formatClock(a.endsAt)}
            </p>
            <p className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted">{formatDuration(a.service.durationMin)}</span>
              <span className="font-semibold">{formatPrice(a.service.price)}</span>
            </p>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">مشتری</dt>
              <dd className="text-end">
                <p className="font-medium">{a.customer.name}</p>
                <a href={`tel:${a.customer.phone}`} dir="ltr" className="inline-flex items-center gap-1 text-muted hover:text-fg">
                  <Phone className="size-3" aria-hidden />
                  {toFa(a.customer.phone)}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">متخصص</dt>
              <dd className="flex items-center gap-2 font-medium">
                {a.staff.name}
                <Avatar staff={a.staff} className="size-8 text-[10px]" />
              </dd>
            </div>
          </dl>

          {active && (
            <div className="grid grid-cols-2 gap-2">
              {a.status === "pending" && (
                <Button onClick={() => setStatus("confirmed")} loading={update.isPending && update.variables?.status === "confirmed"}>
                  <Check className="size-4" aria-hidden />
                  تأیید
                </Button>
              )}
              {a.status === "confirmed" && (
                <Button onClick={() => setStatus("done")} loading={update.isPending && update.variables?.status === "done"}>
                  <CheckCheck className="size-4" aria-hidden />
                  انجام شد
                </Button>
              )}
              <Button variant="secondary" className="text-red-500" onClick={() => setStatus("cancelled")} loading={update.isPending && update.variables?.status === "cancelled"}>
                <X className="size-4" aria-hidden />
                لغو نوبت
              </Button>
              <Button variant="secondary" className="col-span-2" onClick={() => setRescheduling(!rescheduling)} aria-expanded={rescheduling}>
                <CalendarClock className="size-4" aria-hidden />
                تغییر زمان
              </Button>
            </div>
          )}

          {rescheduling && (
            <div className="space-y-4 rounded-3xl border border-line p-4">
              <SlotPicker
                serviceId={a.serviceId}
                staffId={a.staffId}
                ignoreAppointmentId={a.id}
                date={date}
                slot={slot}
                onDateChange={(d) => {
                  setDate(d);
                  setSlot(null);
                }}
                onSlotChange={setSlot}
              />
              <Button className="w-full" disabled={!slot} loading={reschedule.isPending} onClick={saveReschedule}>
                ذخیره زمان جدید
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Textarea label="یادداشت" value={note} onChange={(e) => setNote(e.target.value)} placeholder="یادداشتی برای این نوبت…" />
            <Button
              variant="secondary"
              size="sm"
              onClick={saveNote}
              disabled={note.trim() === (a.note ?? "")}
              loading={update.isPending && update.variables?.note !== undefined}
            >
              ذخیره یادداشت
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
