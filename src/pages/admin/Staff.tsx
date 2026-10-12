import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { CalendarOff, Clock3, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Staff as StaffMember, WorkingHour } from "../../api";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Skeleton } from "../../components/ui/Skeleton";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { useServices } from "../../hooks/useServices";
import { useDeleteTimeOff, useSaveStaff, useSaveWorkingHours, useStaff, useTimeOff, useWorkingHours } from "../../hooks/useStaff";
import { dayjs, formatDay, formatTime, WEEKDAYS } from "../../lib/date";
import { cn } from "../../lib/cn";
import { TimeOffModal } from "./TimeOffModal";

const COLORS = ["#c97770", "#b8924f", "#9a7189", "#7f8f86", "#8a7bb0", "#c48a5a"];

const schema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید"),
  title: z.string().trim().min(2, "عنوان شغلی را وارد کنید"),
  avatar: z.string(),
  serviceIds: z.array(z.string()).min(1, "حداقل یک خدمت انتخاب کنید"),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
const empty: FormValues = { name: "", title: "", avatar: COLORS[0], serviceIds: [], active: true };

export default function Staff() {
  const { data: staff } = useStaff();
  const { data: services } = useServices();
  const { data: hours } = useWorkingHours();
  const { data: timeOff } = useTimeOff();
  const save = useSaveStaff();
  const deleteTimeOff = useDeleteTimeOff();
  const toast = useToast();

  const [editing, setEditing] = useState<StaffMember | "new" | null>(null);
  const [hoursFor, setHoursFor] = useState<StaffMember | null>(null);
  const [timeOffFor, setTimeOffFor] = useState<StaffMember | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });
  const errors = form.formState.errors;
  const avatar = form.watch("avatar");

  function openForm(person: StaffMember | "new") {
    form.reset(person === "new" ? empty : person);
    setEditing(person);
  }

  const submit = form.handleSubmit(async (values) => {
    await save.mutateAsync({ ...values, id: editing === "new" ? undefined : editing!.id });
    toast(editing === "new" ? "همکار جدید اضافه شد" : "تغییرات ذخیره شد");
    setEditing(null);
  });

  async function toggle(person: StaffMember) {
    await save.mutateAsync({ ...person, active: !person.active });
  }

  const loading = !staff || !services || !hours || !timeOff;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">کارکنان</h1>
          <p className="mt-1 text-sm text-muted">خدمات، ساعات کاری و مرخصی هر همکار</p>
        </div>
        <Button variant="accent" onClick={() => openForm("new")}>
          <UserPlus className="size-4" aria-hidden />
          همکار جدید
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {staff.map((person, i) => {
            const own = hours.filter((h) => h.staffId === person.id).sort((a, b) => a.weekday - b.weekday);
            const offs = timeOff.filter((t) => t.staffId === person.id && dayjs(t.endsAt).isAfter(dayjs()));
            return (
              <motion.div key={person.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={cn("h-full p-5", !person.active && "opacity-60")}>
                  <div className="flex items-center gap-4">
                    <Avatar staff={person} className="size-14 text-lg" />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold">{person.name}</h2>
                      <p className="text-sm text-muted">{person.title}</p>
                    </div>
                    <Switch checked={person.active} onChange={() => toggle(person)} label={`فعال بودن ${person.name}`} />
                    <Button variant="ghost" size="sm" className="w-9 px-0" onClick={() => openForm(person)} aria-label={`ویرایش ${person.name}`}>
                      <Pencil className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {person.serviceIds.map((id) => (
                      <span key={id} className="rounded-full bg-elevated px-2.5 py-1 text-xs">
                        {services.find((s) => s.id === id)?.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-sm font-medium">
                          <Clock3 className="size-4 text-muted" aria-hidden />
                          ساعات کاری
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setHoursFor(person)}>
                          ویرایش
                        </Button>
                      </div>
                      <ul className="space-y-1 text-xs">
                        {own.length === 0 && <li className="text-muted">ساعت کاری تعریف نشده</li>}
                        {own.map((h) => (
                          <li key={h.weekday} className="flex justify-between text-muted">
                            <span>{WEEKDAYS[h.weekday]}</span>
                            <span className="tabular-nums">
                              {formatTime(h.startMin)} – {formatTime(h.endMin)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-sm font-medium">
                          <CalendarOff className="size-4 text-muted" aria-hidden />
                          مرخصی‌ها
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setTimeOffFor(person)}>
                          <Plus className="size-3.5" aria-hidden />
                          افزودن
                        </Button>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {offs.length === 0 && <li className="text-muted">مرخصی پیش‌رو ندارد</li>}
                        {offs.map((t) => (
                          <li key={t.id} className="flex items-center justify-between gap-2 rounded-xl bg-elevated px-2.5 py-1.5">
                            <span>
                              {formatDay(t.startsAt)}
                              {dayjs(t.endsAt).diff(t.startsAt, "day") > 1 && ` تا ${formatDay(dayjs(t.endsAt).subtract(1, "minute"))}`}
                              {t.reason && <span className="text-muted"> · {t.reason}</span>}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteTimeOff.mutate(t.id)}
                              aria-label="حذف مرخصی"
                              className="cursor-pointer rounded-lg p-1 text-muted hover:text-red-500"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "همکار جدید" : "ویرایش همکار"}
        footer={
          <>
            <Button onClick={submit} loading={save.isPending}>
              ذخیره
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              انصراف
            </Button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-5" noValidate>
          <Input label="نام و نام خانوادگی" error={errors.name?.message} {...form.register("name")} />
          <Input label="عنوان شغلی" placeholder="مثلاً متخصص رنگ" error={errors.title?.message} {...form.register("title")} />
          <fieldset>
            <legend className="mb-2 text-sm font-medium">رنگ آواتار</legend>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => form.setValue("avatar", color)}
                  aria-label={`رنگ ${color}`}
                  aria-pressed={avatar === color}
                  className={cn("size-9 cursor-pointer rounded-full ring-offset-2 ring-offset-surface transition", avatar === color && "ring-2 ring-fg")}
                  style={{ background: color }}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">خدمات قابل ارائه</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {services?.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-sm has-checked:border-blush-400 has-checked:bg-blush-50 dark:has-checked:border-champagne-300/50 dark:has-checked:bg-white/5">
                  <input type="checkbox" value={s.id} className="size-4 accent-blush-500" {...form.register("serviceIds")} />
                  {s.name}
                </label>
              ))}
            </div>
            {errors.serviceIds && <p className="mt-2 text-xs text-red-500">{errors.serviceIds.message}</p>}
          </fieldset>
          <button type="submit" hidden />
        </form>
      </Modal>

      {hoursFor && hours && <HoursModal person={hoursFor} hours={hours} onClose={() => setHoursFor(null)} />}
      <TimeOffModal open={!!timeOffFor} onClose={() => setTimeOffFor(null)} staffId={timeOffFor?.id ?? null} title={`مرخصی ${timeOffFor?.name ?? ""}`} />
    </div>
  );
}

function toTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function toMin(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

type DayRow = { on: boolean; start: string; end: string };

function HoursModal({ person, hours, onClose }: { person: StaffMember; hours: WorkingHour[]; onClose: () => void }) {
  const [rows, setRows] = useState<DayRow[]>(() =>
    WEEKDAYS.map((_, weekday) => {
      const h = hours.find((x) => x.staffId === person.id && x.weekday === weekday);
      return { on: !!h, start: toTime(h?.startMin ?? 600), end: toTime(h?.endMin ?? 1080) };
    }),
  );
  const saveHours = useSaveWorkingHours();
  const toast = useToast();
  const invalid = rows.some((r) => r.on && toMin(r.end) <= toMin(r.start));

  function update(i: number, patch: Partial<DayRow>) {
    setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  async function save() {
    await saveHours.mutateAsync({
      staffId: person.id,
      hours: rows.flatMap((r, weekday) => (r.on ? [{ weekday, startMin: toMin(r.start), endMin: toMin(r.end) }] : [])),
    });
    toast("ساعات کاری ذخیره شد");
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`ساعات کاری ${person.name}`}
      footer={
        <>
          <Button onClick={save} disabled={invalid} loading={saveHours.isPending}>
            ذخیره
          </Button>
          <Button variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-line px-3 py-2">
            <Switch checked={row.on} onChange={(on) => update(i, { on })} label={`کار در ${WEEKDAYS[i]}`} />
            <span className="w-20 text-sm font-medium">{WEEKDAYS[i]}</span>
            {row.on ? (
              <div className="flex flex-1 items-center gap-2" dir="ltr">
                <input type="time" step={900} value={row.start} onChange={(e) => update(i, { start: e.target.value })} aria-label={`شروع ${WEEKDAYS[i]}`} className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface px-2 text-sm" />
                <span className="text-muted">–</span>
                <input type="time" step={900} value={row.end} onChange={(e) => update(i, { end: e.target.value })} aria-label={`پایان ${WEEKDAYS[i]}`} className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface px-2 text-sm" />
              </div>
            ) : (
              <span className="flex-1 text-sm text-muted">تعطیل</span>
            )}
          </div>
        ))}
        {invalid && <p className="text-xs text-red-500">ساعت پایان باید بعد از ساعت شروع باشد</p>}
      </div>
    </Modal>
  );
}
