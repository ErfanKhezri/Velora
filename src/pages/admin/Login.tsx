import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import { z } from "zod";
import { DemoBanner } from "../../components/DemoBanner";
import { LiveBackground } from "../../components/LiveBackground";
import { Logo } from "../../components/Logo";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAdminLogin } from "../../hooks/useSettings";
import { useAuth } from "../../lib/auth";

const schema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export default function Login() {
  const { admin, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const login = useAdminLogin();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { username: "", password: "" } });
  const errors = form.formState.errors;

  if (admin) return <Navigate to="/admin" replace />;

  const submit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      loginAdmin();
      navigate("/admin", { replace: true });
    } catch (e) {
      form.setError("password", { message: (e as Error).message });
    }
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <LiveBackground />
      <DemoBanner />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-orchid-200/60 blur-3xl dark:bg-orchid-800/30" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-iris-200/60 blur-3xl dark:bg-iris-700/20" />
        <div className="absolute top-4 end-4">
          <ThemeToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
          <div className="mb-8 text-center">
            <Logo />
            <p className="mt-2 text-sm text-muted">ورود به پنل مدیریت سالن</p>
          </div>
          <Card className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-4" noValidate>
              <Input label="نام کاربری" autoComplete="username" dir="ltr" error={errors.username?.message} {...form.register("username")} />
              <Input label="رمز عبور" type="password" autoComplete="current-password" dir="ltr" error={errors.password?.message} {...form.register("password")} />
              <Button type="submit" className="w-full" loading={login.isPending}>
                ورود
              </Button>
            </form>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-iris-300 bg-iris-50 p-4 text-sm dark:border-iris-300/30 dark:bg-iris-300/5">
              <KeyRound className="mt-0.5 size-4 shrink-0 text-iris-600 dark:text-iris-300" aria-hidden />
              <div className="leading-7">
                <p className="font-medium">اطلاعات ورود نمایشی</p>
                <p className="text-muted">
                  نام کاربری: <code dir="ltr" className="font-semibold text-fg">admin</code> — رمز: <code dir="ltr" className="font-semibold text-fg">velora</code>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
