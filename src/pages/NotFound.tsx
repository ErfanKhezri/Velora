import { motion } from "motion/react";
import { Link } from "react-router";
import { buttonStyles } from "../components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-gradient text-8xl font-black"
      >
        ۴۰۴
      </motion.p>
      <h1 className="mt-4 text-2xl font-bold">این صفحه پیدا نشد</h1>
      <p className="mt-2 leading-8 text-muted">شاید آدرس اشتباه است یا صفحه جابه‌جا شده. بیایید از اول شروع کنیم.</p>
      <Link to="/" className={buttonStyles("primary", "md", "mt-8")}>
        بازگشت به خانه
      </Link>
    </section>
  );
}
