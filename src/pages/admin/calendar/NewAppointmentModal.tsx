import { Search, UserPlus, UserRound } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { z } from "zod";
import type { Customer, Slot } from "../../../api";
import { Button } from "../../../components/ui/Button";
import { Input, Select, Textarea } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { useToast } from "../../../components/ui/Toast";
import { useAdminCreateAppointment } from "../../../hooks/useAppointments";
import { useCreateCustomer, useSearchCustomers } from "../../../hooks/useCustomers";
import { useServices } from "../../../hooks/useServices";
import { useStaff } from "../../../hooks/useStaff";
import { formatPrice, toEn, toFa } from "../../../lib/date";
import { cn } from "../../../lib/cn";
import { SlotPicker } from "./SlotPicker";

const newCustomerSchema = z.object({
  name: z.string().trim().min(2, "نام مشتری را وارد کنید"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});

type Props = { open: boolean; onClose: () => void; onCreated: (date: string) => void };

export function NewAppointmentModal({ open, onClose, onCreated }: Props) {
  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("any");
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [note, setNote] = useState("");

  const services = useServices();
  const staff = useStaff(serviceId || undefined);
  const results = useSearchCustomers(useDeferredValue(toEn(query)));
  const createCustomer = useCreateCustomer();
  const create = useAdminCreateAppointment();
  const toast = useToast();

  function reset() {
    setQuery("");
    setCustomer(null);
    setIsNew(false);
    setNewName("");
    setNewPhone("");
    setErrors({});
    setServiceId("");
    setStaffId("any");
    setDate(null);
    setSlot(null);
    setNote("");
  }

  function close() {
    reset();
    onClose();
  }

  async function submit() {
    let who = customer;
    if (isNew) {
      const parsed = newCustomerSchema.safeParse({ name: newName, phone: toEn(newPhone).replace(/\s/g, "") });
      if (!parsed.success) {
        const issues = z.flattenError(parsed.error).fieldErrors;
        setErrors({ name: issues.name?.[0], phone: issues.phone?.[0] });
        return;
      }
      who = await createCustomer.mutateAsync(parsed.data);
    }
    try {
      await create.mutateAsync({
        customerId: who!.id,
        serviceId,
        staffId: staffId === "any" ? null : staffId,
        date: date!,
        startMin: slot!.startMin,
        note: note.trim(),
      });
      toast("نوبت تلفنی ثبت شد");
      onCreated(date!);
      close();
    } catch (e) {
      toast((e as Error).message, "error");
      setSlot(null);
    }
  }

  const hasCustomer = isNew ? !!newName && !!newPhone : !!customer;
  const ready = hasCustomer && serviceId && date && slot;

  return (
    <Modal
      open={open}
      onClose={close}
      title="نوبت جدید (تلفنی)"
      footer={
        <>
          <Button onClick={submit} disabled={!ready} loading={create.isPending || createCustomer.isPending}>
            ثبت نوبت
          </Button>
          <Button variant="ghost" onClick={close}>
            انصراف
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">مشتری</h3>
            <Button variant="ghost" size="sm" onClick={() => { setIsNew(!isNew); setCustomer(null); }}>
              {isNew ? <Search className="size-4" aria-hidden /> : <UserPlus className="size-4" aria-hidden />}
              {isNew ? "جست‌وجوی مشتری" : "مشتری جدید"}
            </Button>
          </div>

          {isNew ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="نام" value={newName} onChange={(e) => setNewName(e.target.value)} error={errors.name} />
              <Input label="موبایل" dir="ltr" inputMode="tel" placeholder="09…" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} error={errors.phone} />
            </div>
          ) : customer ? (
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-elevated/60 p-3">
              <UserRound className="size-5 text-muted" aria-hidden />
              <div className="flex-1">
                <p className="font-medium">{customer.name}</p>
                <p dir="ltr" className="text-end text-xs text-muted">{toFa(customer.phone)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCustomer(null)}>
                تغییر
              </Button>
            </div>
          ) : (
            <div>
              <Input label="جست‌وجو با نام یا موبایل" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="مثلاً نازنین یا ۰۹۱۲…" />
              {query.trim() && (
                <ul className="mt-2 max-h-48 overflow-y-auto rounded-2xl border border-line">
                  {results.isFetching && !results.data && <li className="p-3 text-sm text-muted">در حال جست‌وجو…</li>}
                  {results.data?.length === 0 && <li className="p-3 text-sm text-muted">مشتری‌ای پیدا نشد؛ «مشتری جدید» را بزنید.</li>}
                  {results.data?.map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => setCustomer(c)} className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-elevated">
                        <span>{c.name}</span>
                        <span dir="ltr" className="text-muted">{toFa(c.phone)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Select
            label="خدمت"
            value={serviceId}
            onChange={(e) => {
              setServiceId(e.target.value);
              setStaffId("any");
              setSlot(null);
            }}
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            {services.data
              ?.filter((s) => s.active)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {formatPrice(s.price)}
                </option>
              ))}
          </Select>
          <Select
            label="متخصص"
            value={staffId}
            disabled={!serviceId}
            onChange={(e) => {
              setStaffId(e.target.value);
              setSlot(null);
            }}
          >
            <option value="any">اولین متخصص آزاد</option>
            {serviceId && staff.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </section>

        <section className={cn(!serviceId && "pointer-events-none opacity-40")} aria-disabled={!serviceId}>
          <h3 className="mb-3 font-semibold">تاریخ و ساعت</h3>
          {serviceId ? (
            <SlotPicker
              serviceId={serviceId}
              staffId={staffId === "any" ? null : staffId}
              date={date}
              slot={slot}
              onDateChange={(d) => {
                setDate(d);
                setSlot(null);
              }}
              onSlotChange={setSlot}
            />
          ) : (
            <p className="rounded-2xl bg-elevated p-4 text-center text-sm text-muted">ابتدا خدمت را انتخاب کنید</p>
          )}
        </section>

        <Textarea label="یادداشت (اختیاری)" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
    </Modal>
  );
}
