import { useState } from "react";
import { JalaliCalendar } from "../../components/JalaliCalendar";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { useAddTimeOff } from "../../hooks/useStaff";
import { dayjs, formatDay, toFa, today } from "../../lib/date";

type Props = { open: boolean; onClose: () => void; staffId: string | null; title: string };

/** Adds whole-day time off for one staff member, or a salon closure when staffId is null. */
export function TimeOffModal({ open, onClose, staffId, title }: Props) {
  const [month, setMonth] = useState(today());
  const [date, setDate] = useState<string | null>(null);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");
  const add = useAddTimeOff();
  const toast = useToast();

  function close() {
    setDate(null);
    setDays(1);
    setReason("");
    onClose();
  }

  async function save() {
    const start = dayjs(date).startOf("day");
    await add.mutateAsync({
      staffId,
      startsAt: start.toISOString(),
      endsAt: start.add(days, "day").toISOString(),
      reason: reason.trim() || undefined,
    });
    toast("ثبت شد");
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      footer={
        <>
          <Button onClick={save} disabled={!date} loading={add.isPending}>
            ثبت
          </Button>
          <Button variant="ghost" onClick={close}>
            انصراف
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <JalaliCalendar month={month} onMonthChange={setMonth} value={date} onChange={setDate} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="مدت" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            {Array.from({ length: 14 }, (_, i) => (
              <option key={i} value={i + 1}>
                {toFa(i + 1)} روز
              </option>
            ))}
          </Select>
          <Input label="دلیل (اختیاری)" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="مثلاً مرخصی" />
        </div>
        {date && (
          <p className="text-sm text-muted">
            از {formatDay(date)} تا پایان {formatDay(dayjs(date).add(days - 1, "day"))}
          </p>
        )}
      </div>
    </Modal>
  );
}
