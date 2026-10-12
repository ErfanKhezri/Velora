import { CalendarOff, Plus, RotateCcw, Timer, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { Tabs } from "../../components/ui/Tabs";
import { useToast } from "../../components/ui/Toast";
import { useResetDemo, useSettings, useUpdateSettings } from "../../hooks/useSettings";
import { useDeleteTimeOff, useTimeOff } from "../../hooks/useStaff";
import { dayjs, formatDay, toFa } from "../../lib/date";
import { TimeOffModal } from "./TimeOffModal";

export default function Settings() {
  const { data: settings } = useSettings();
  const { data: timeOff } = useTimeOff();
  const updateSettings = useUpdateSettings();
  const deleteTimeOff = useDeleteTimeOff();
  const reset = useResetDemo();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const closures = timeOff?.filter((t) => t.staffId === null && dayjs(t.endsAt).isAfter(dayjs())) ?? [];

  async function changeInterval(value: "15" | "30") {
    await updateSettings.mutateAsync({ ...settings!, slotInterval: Number(value) as 15 | 30 });
    toast("فاصله نوبت‌ها به‌روز شد");
  }

  async function resetDemo() {
    await reset.mutateAsync();
    setConfirmReset(false);
    toast("داده‌های نمایشی بازنشانی شد");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">تنظیمات</h1>
        <p className="mt-1 text-sm text-muted">تنظیمات کلی سالن و داده‌های نمایشی</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Timer className="mt-0.5 size-5 text-orchid-500 dark:text-iris-300" aria-hidden />
            <div>
              <h2 className="font-semibold">فاصله زمان‌های نوبت</h2>
              <p className="mt-1 text-sm text-muted">زمان‌های آزاد با این فاصله به مشتری پیشنهاد می‌شوند</p>
            </div>
          </div>
          {settings ? (
            <Tabs
              value={String(settings.slotInterval) as "15" | "30"}
              onChange={changeInterval}
              tabs={[
                { id: "15", label: `${toFa(15)} دقیقه` },
                { id: "30", label: `${toFa(30)} دقیقه` },
              ]}
            />
          ) : (
            <Skeleton className="h-11 w-48" />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CalendarOff className="mt-0.5 size-5 text-orchid-500 dark:text-iris-300" aria-hidden />
            <div>
              <h2 className="font-semibold">تعطیلی‌های سالن</h2>
              <p className="mt-1 text-sm text-muted">در این روزها هیچ نوبتی قابل رزرو نیست</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
            <Plus className="size-4" aria-hidden />
            افزودن تعطیلی
          </Button>
        </div>
        <ul className="mt-5 space-y-2">
          {!timeOff && <Skeleton className="h-12" />}
          {timeOff && closures.length === 0 && <li className="rounded-2xl bg-elevated p-4 text-center text-sm text-muted">تعطیلی پیش‌رویی ثبت نشده</li>}
          {closures.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 text-sm">
              <span>
                {formatDay(t.startsAt)}
                {dayjs(t.endsAt).diff(t.startsAt, "day") > 1 && ` تا ${formatDay(dayjs(t.endsAt).subtract(1, "minute"))}`}
                {t.reason && <span className="text-muted"> · {t.reason}</span>}
              </span>
              <Button variant="ghost" size="sm" className="w-9 px-0 text-red-500" onClick={() => deleteTimeOff.mutate(t.id)} aria-label="حذف تعطیلی">
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-red-200 p-6 dark:border-red-400/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <RotateCcw className="mt-0.5 size-5 text-red-500" aria-hidden />
            <div>
              <h2 className="font-semibold">بازنشانی داده‌های نمایشی</h2>
              <p className="mt-1 text-sm text-muted">همه تغییرات و نوبت‌ها پاک شده و داده‌های اولیه برمی‌گردند</p>
            </div>
          </div>
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            بازنشانی
          </Button>
        </div>
      </Card>

      <TimeOffModal open={adding} onClose={() => setAdding(false)} staffId={null} title="تعطیلی سالن" />
      <ConfirmDialog
        open={confirmReset}
        title="بازنشانی داده‌ها"
        text="همه نوبت‌ها، خدمات و تغییرات شما پاک می‌شود و داده‌های نمایشی اولیه جایگزین می‌شوند. ادامه می‌دهید؟"
        confirmLabel="بله، بازنشانی کن"
        loading={reset.isPending}
        onConfirm={resetDemo}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}
