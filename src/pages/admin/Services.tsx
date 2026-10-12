import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { Clock3, Pencil, Plus, Scissors, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Service } from "../../api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Skeleton } from "../../components/ui/Skeleton";
import { Switch } from "../../components/ui/Switch";
import { useToast } from "../../components/ui/Toast";
import { useDeleteService, useSaveService, useServices } from "../../hooks/useServices";
import { CATEGORIES, CATEGORY_ICON, CATEGORY_LABEL } from "../../lib/constants";
import { formatDuration, formatPrice } from "../../lib/date";
import { cn } from "../../lib/cn";

const schema = z.object({
  name: z.string().trim().min(2, "نام خدمت را وارد کنید"),
  category: z.enum(["hair", "color", "nails", "skin", "makeup"]),
  durationMin: z.number({ error: "مدت را وارد کنید" }).int().min(15, "حداقل ۱۵ دقیقه").max(480, "حداکثر ۸ ساعت"),
  price: z.number({ error: "قیمت را وارد کنید" }).min(0, "قیمت معتبر نیست"),
  description: z.string().trim().max(160, "حداکثر ۱۶۰ کاراکتر"),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const empty: FormValues = { name: "", category: "hair", durationMin: 60, price: 500_000, description: "", active: true };

export default function Services() {
  const { data: services } = useServices();
  const save = useSaveService();
  const remove = useDeleteService();
  const toast = useToast();
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });
  const errors = form.formState.errors;

  function openForm(service: Service | "new") {
    form.reset(service === "new" ? empty : service);
    setEditing(service);
  }

  const submit = form.handleSubmit(async (values) => {
    await save.mutateAsync({ ...values, id: editing === "new" ? undefined : editing!.id });
    toast(editing === "new" ? "خدمت جدید اضافه شد" : "تغییرات ذخیره شد");
    setEditing(null);
  });

  async function toggle(service: Service) {
    await save.mutateAsync({ ...service, active: !service.active });
    toast(service.active ? "خدمت غیرفعال شد" : "خدمت فعال شد");
  }

  async function confirmDelete() {
    await remove.mutateAsync(deleting!.id);
    toast("خدمت حذف شد");
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">خدمات</h1>
          <p className="mt-1 text-sm text-muted">قیمت، مدت و وضعیت نمایش خدمات را مدیریت کنید</p>
        </div>
        <Button variant="accent" onClick={() => openForm("new")}>
          <Plus className="size-4" aria-hidden />
          خدمت جدید
        </Button>
      </div>

      {!services ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card>
          <EmptyState icon={Scissors} title="هنوز خدمتی تعریف نشده" action={<Button onClick={() => openForm("new")}>افزودن خدمت</Button>} />
        </Card>
      ) : (
        CATEGORIES.map((category) => {
          const items = services.filter((s) => s.category === category.id);
          if (!items.length) return null;
          const Icon = CATEGORY_ICON[category.id];
          return (
            <section key={category.id}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
                <Icon className="size-4" aria-hidden />
                {category.label}
              </h2>
              <Card className="divide-y divide-line overflow-hidden">
                <AnimatePresence initial={false}>
                  {items.map((s) => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4", !s.active && "opacity-60")}
                    >
                      <div className="min-w-0 flex-1 basis-48">
                        <p className="font-semibold">{s.name}</p>
                        <p className="truncate text-xs text-muted">{s.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-muted">
                        <Clock3 className="size-3.5" aria-hidden />
                        {formatDuration(s.durationMin)}
                      </span>
                      <span className="w-36 text-sm font-semibold">{formatPrice(s.price)}</span>
                      <div className="flex items-center gap-1">
                        <Switch checked={s.active} onChange={() => toggle(s)} label={`فعال بودن ${s.name}`} />
                        <Button variant="ghost" size="sm" className="w-9 px-0" onClick={() => openForm(s)} aria-label={`ویرایش ${s.name}`}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-9 px-0 text-red-500" onClick={() => setDeleting(s)} aria-label={`حذف ${s.name}`}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Card>
            </section>
          );
        })
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "خدمت جدید" : "ویرایش خدمت"}
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
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input label="نام خدمت" error={errors.name?.message} {...form.register("name")} />
          <Select label="دسته‌بندی" {...form.register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {CATEGORY_LABEL[c.id]}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="مدت (دقیقه)" type="number" step={15} min={15} dir="ltr" error={errors.durationMin?.message} {...form.register("durationMin", { valueAsNumber: true })} />
            <Input label="قیمت (تومان)" type="number" step={10000} min={0} dir="ltr" error={errors.price?.message} {...form.register("price", { valueAsNumber: true })} />
          </div>
          <Textarea label="توضیح کوتاه" error={errors.description?.message} {...form.register("description")} />
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="size-4 accent-orchid-500" {...form.register("active")} />
            نمایش در سایت (فعال)
          </label>
          <button type="submit" hidden />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="حذف خدمت"
        text={`«${deleting?.name ?? ""}» حذف شود؟ نوبت‌های قبلی این خدمت در تاریخچه می‌مانند.`}
        confirmLabel="حذف"
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
