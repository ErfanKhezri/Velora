import { CalendarX2 } from "lucide-react";
import type { Slot } from "../../api";
import { TimeSlots } from "../../components/TimeSlots";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAvailability } from "../../hooks/useAvailability";
import { formatDay } from "../../lib/date";

type Props = {
  serviceId: string;
  staffId: string | null;
  date: string;
  value: Slot | null;
  onChange: (slot: Slot) => void;
  onChangeDate: () => void;
};

export function StepTime({ serviceId, staffId, date, value, onChange, onChangeDate }: Props) {
  const { data: slots } = useAvailability(serviceId, staffId, date);

  return (
    <div>
      <p className="mb-5 text-sm text-muted">
        زمان‌های آزاد برای <span className="font-medium text-fg">{formatDay(date)}</span>
      </p>
      {!slots ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : slots.length ? (
        <TimeSlots slots={slots} value={value?.startMin ?? null} onChange={onChange} />
      ) : (
        <EmptyState
          icon={CalendarX2}
          title="این روز پر شده است"
          text="زمان آزادی برای این روز باقی نمانده. روز دیگری را امتحان کنید."
          action={<Button variant="secondary" onClick={onChangeDate}>انتخاب روز دیگر</Button>}
        />
      )}
    </div>
  );
}
