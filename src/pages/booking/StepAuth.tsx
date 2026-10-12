import { LogOut, UserRound } from "lucide-react";
import type { AppointmentDetails, NewAppointment } from "../../api";
import { PhoneLogin } from "../../components/PhoneLogin";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import { useCreateAppointment } from "../../hooks/useAppointments";
import { useAuth } from "../../lib/auth";
import { toFa } from "../../lib/date";

type Props = {
  input: Omit<NewAppointment, "customerId" | "note">;
  note: string;
  onNoteChange: (note: string) => void;
  onBooked: (appointment: AppointmentDetails) => void;
  onSlotTaken: () => void;
};

export function StepAuth({ input, note, onNoteChange, onBooked, onSlotTaken }: Props) {
  const { customer, logoutCustomer } = useAuth();
  const toast = useToast();
  const create = useCreateAppointment();

  if (!customer) {
    return (
      <div className="mx-auto max-w-sm">
        <p className="mb-6 text-sm leading-7 text-muted">برای ثبت نوبت، شماره موبایل خود را وارد کنید. کد تأیید برایتان نمایش داده می‌شود.</p>
        <PhoneLogin />
      </div>
    );
  }

  async function submit() {
    try {
      const appointment = await create.mutateAsync({ ...input, customerId: customer!.id, note: note.trim() });
      onBooked(appointment);
    } catch (e) {
      toast((e as Error).message, "error");
      onSlotTaken();
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-3 glass rounded-3xl p-4">
        <span className="grid size-11 place-items-center rounded-full bg-white/70 dark:bg-white/10 text-orchid-600 dark:text-iris-300">
          <UserRound className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{customer.name}</p>
          <p dir="ltr" className="text-end text-sm text-muted">
            {toFa(customer.phone)}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={logoutCustomer}>
          <LogOut className="size-4" aria-hidden />
          تغییر
        </Button>
      </div>

      <Textarea
        label="یادداشت برای سالن (اختیاری)"
        placeholder="مثلاً حساسیت پوستی، مدل مورد نظر یا هر نکته دیگر"
        value={note}
        maxLength={300}
        onChange={(e) => onNoteChange(e.target.value)}
      />

      <Button variant="accent" size="lg" className="w-full" loading={create.isPending} onClick={submit}>
        تأیید و ثبت نوبت
      </Button>
    </div>
  );
}
