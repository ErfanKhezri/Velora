import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Customer } from "../api";
import { useCreateCustomer, useRequestOtp, useVerifyOtp } from "../hooks/useCustomers";
import { useAuth } from "../lib/auth";
import { toEn, toFa } from "../lib/date";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useToast } from "./ui/Toast";

const phoneSchema = z.object({
  phone: z
    .string()
    .transform((v) => toEn(v).replace(/\s/g, ""))
    .pipe(z.string().regex(/^09\d{9}$/, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود")),
});
const codeSchema = z.object({
  code: z
    .string()
    .transform(toEn)
    .pipe(z.string().regex(/^\d{4}$/, "کد ۴ رقمی را وارد کنید")),
});
const nameSchema = z.object({ name: z.string().trim().min(2, "نام خود را وارد کنید") });

type Stage = "phone" | "code" | "name";

export function PhoneLogin({ onDone }: { onDone?: (customer: Customer) => void }) {
  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const { loginCustomer } = useAuth();
  const toast = useToast();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const createCustomer = useCreateCustomer();

  const phoneForm = useForm({ resolver: zodResolver(phoneSchema), defaultValues: { phone: "" } });
  const codeForm = useForm({ resolver: zodResolver(codeSchema), defaultValues: { code: "" } });
  const nameForm = useForm({ resolver: zodResolver(nameSchema), defaultValues: { name: "" } });

  function finish(customer: Customer) {
    loginCustomer(customer);
    toast(`${customer.name} عزیز، خوش آمدید`);
    onDone?.(customer);
  }

  const sendCode = phoneForm.handleSubmit(async ({ phone }) => {
    const { demoCode } = await requestOtp.mutateAsync(phone);
    setPhone(phone);
    setStage("code");
    toast(`کد دمو: ${demoCode}`, "info");
  });

  const checkCode = codeForm.handleSubmit(async ({ code }) => {
    try {
      const customer = await verifyOtp.mutateAsync({ phone, code });
      if (customer) finish(customer);
      else setStage("name");
    } catch (e) {
      codeForm.setError("code", { message: (e as Error).message });
    }
  });

  const saveName = nameForm.handleSubmit(async ({ name }) => {
    finish(await createCustomer.mutateAsync({ phone, name }));
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={stage} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
        {stage === "phone" && (
          <form onSubmit={sendCode} className="space-y-4" noValidate>
            <Input
              label="شماره موبایل"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="09xx xxx xxxx"
              className="[&_input]:text-left"
              error={phoneForm.formState.errors.phone?.message}
              {...phoneForm.register("phone")}
            />
            <Button type="submit" className="w-full" loading={requestOtp.isPending}>
              دریافت کد تأیید
            </Button>
          </form>
        )}

        {stage === "code" && (
          <form onSubmit={checkCode} className="space-y-4" noValidate>
            <p className="text-sm leading-7 text-muted">
              کد ارسال‌شده به <span dir="ltr" className="font-medium text-fg">{toFa(phone)}</span> را وارد کنید.
            </p>
            <Input
              label="کد تأیید"
              inputMode="numeric"
              autoComplete="one-time-code"
              dir="ltr"
              maxLength={4}
              autoFocus
              className="[&_input]:text-center [&_input]:text-xl [&_input]:tracking-[0.6em]"
              hint="در نسخه نمایشی کد ۱۲۳۴ است"
              error={codeForm.formState.errors.code?.message}
              {...codeForm.register("code")}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" loading={verifyOtp.isPending}>
                تأیید
              </Button>
              <Button type="button" variant="ghost" onClick={() => setStage("phone")}>
                تغییر شماره
              </Button>
            </div>
          </form>
        )}

        {stage === "name" && (
          <form onSubmit={saveName} className="space-y-4" noValidate>
            <p className="text-sm leading-7 text-muted">اولین بار است که به ولورا می‌آیید؛ خوشحالیم! نام شما چیست؟</p>
            <Input label="نام و نام خانوادگی" autoComplete="name" autoFocus error={nameForm.formState.errors.name?.message} {...nameForm.register("name")} />
            <Button type="submit" className="w-full" loading={createCustomer.isPending}>
              ادامه
            </Button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
