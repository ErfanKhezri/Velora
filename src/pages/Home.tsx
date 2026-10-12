import { motion, type Variants } from "motion/react";
import { ArrowLeft, CalendarHeart, Clock3, Gem, MapPin, Phone, Sparkles, Star } from "lucide-react";
import { Link } from "react-router";
import { InstagramIcon } from "../components/BrandIcons";
import { InstallButton } from "../components/InstallButton";
import { Avatar } from "../components/ui/Avatar";
import { buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { useServices } from "../hooks/useServices";
import { useStaff } from "../hooks/useStaff";
import { CATEGORIES, CATEGORY_ICON, SALON } from "../lib/constants";
import { formatDuration, formatPrice, toFa } from "../lib/date";
import { cn } from "../lib/cn";

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const;

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Team />
      <Gallery />
      <Visit />
      <FinalCta />
    </>
  );
}

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <motion.div variants={rise} {...inView} className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-iris-600 dark:text-iris-300">
        <span className="h-px w-6 bg-current" />
        {kicker}
        <span className="h-px w-6 bg-current" />
      </p>
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-8 text-muted">{text}</p>}
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-orchid-200/70 blur-3xl dark:bg-orchid-800/25" />
      <div className="pointer-events-none absolute top-40 -left-40 size-[28rem] rounded-full bg-iris-200/70 blur-3xl dark:bg-iris-700/15" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
        <motion.div initial="hidden" animate="show">
          <motion.p variants={rise} custom={0} className="inline-flex items-center gap-2 rounded-full glass-thin border px-4 py-1.5 text-sm text-iris-700 dark:text-iris-200">
            <Sparkles className="size-4" aria-hidden />
            سالن زیبایی تخصصی بانوان
          </motion.p>
          <motion.h1 variants={rise} custom={1} dir="ltr" className="text-gradient mt-6 text-end text-6xl font-light tracking-[0.2em] sm:text-7xl lg:text-8xl">
            VELORA
          </motion.h1>
          <motion.p variants={rise} custom={2} className="mt-5 text-2xl leading-relaxed font-semibold sm:text-3xl">
            زیبایی آرام، با دقتی هنرمندانه
          </motion.p>
          <motion.p variants={rise} custom={3} className="mt-4 max-w-lg leading-8 text-muted">
            از کوتاهی و رنگ تا ناخن، پوست و میکاپ؛ متخصصان ولورا در فضایی دنج و لوکس منتظر شما هستند. نوبتتان را در کمتر از یک دقیقه رزرو کنید.
          </motion.p>
          <motion.div variants={rise} custom={4} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/book" className={buttonStyles("accent", "lg", "group")}>
              <CalendarHeart className="size-5" aria-hidden />
              رزرو نوبت
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </Link>
            <a href="#services" className={buttonStyles("secondary", "lg")}>
              مشاهده خدمات
            </a>
            <InstallButton />
          </motion.div>
          <motion.dl variants={rise} custom={5} className="mt-10 flex gap-8 text-sm">
            {[
              ["+۸", "سال تجربه"],
              ["+۳٬۰۰۰", "مشتری خوشحال"],
              ["۴٫۹", "امتیاز مشتریان"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-bold">{value}</dd>
                <dd className="text-muted">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <HeroArt />
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-sm lg:max-w-md"
      aria-hidden
    >
      {/* An arched mirror, the salon's signature shape */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-iris-300/50 bg-gradient-to-b from-orchid-100 via-mist to-iris-100 shadow-glow dark:from-night-700 dark:via-night-800 dark:to-night-900">
        <div className="absolute inset-4 rounded-t-full border border-iris-300/40" />
        <div className="absolute top-1/4 left-1/2 size-56 -translate-x-1/2 rounded-full bg-gradient-to-br from-orchid-300/80 to-iris-300/70 blur-2xl dark:from-orchid-500/40 dark:to-iris-400/30" />
        <svg viewBox="0 0 200 250" className="absolute inset-0 size-full text-orchid-700/70 dark:text-iris-200/70" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M100 40c-30 30-40 70-20 110s50 60 20 100" />
          <path d="M100 40c30 30 40 70 20 110s-50 60-20 100" />
          <path d="M60 210c20-10 60-10 80 0" />
          <circle cx="100" cy="120" r="34" strokeDasharray="2 4" />
          <path d="M85 95l15-20 15 20M88 140c6 6 18 6 24 0" />
        </svg>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 grid size-16 -translate-x-1/2 place-items-center glass rounded-full"
        >
          <Gem className="size-7 text-iris-500 dark:text-iris-300" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute top-16 -right-4 glass rounded-2xl p-3 sm:-right-10"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
            <Clock3 className="size-4" />
          </span>
          <div className="text-xs">
            <p className="text-muted">اولین نوبت آزاد</p>
            <p className="font-semibold">امروز، ساعت ۱۶:۳۰</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-24 -left-4 glass rounded-2xl p-3 sm:-left-10"
      >
        <div className="flex items-center gap-1 text-iris-500 dark:text-iris-300">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3.5 fill-current" />
          ))}
        </div>
        <p className="mt-1 text-xs font-medium">«بهترین بالیاژی که داشتم»</p>
      </motion.div>
    </motion.div>
  );
}

function Services() {
  const { data: services } = useServices();

  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle kicker="خدمات" title="هر آنچه برای درخشیدن لازم دارید" text="خدمات تخصصی با بهترین متریال؛ زمان و هزینه هر خدمت از قبل مشخص است." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {!services
            ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-64" />)
            : CATEGORIES.map((category, i) => {
                const items = services.filter((s) => s.active && s.category === category.id);
                if (!items.length) return null;
                const Icon = CATEGORY_ICON[category.id];
                return (
                  <motion.div key={category.id} variants={rise} custom={i} {...inView} className={cn(i === 0 && "lg:row-span-2")}>
                    <Card className="h-full p-6 transition-shadow hover:shadow-glow">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-orchid-100 to-iris-100 text-orchid-600 dark:from-white/10 dark:to-white/5 dark:text-iris-300">
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <h3 className="text-xl font-bold">{category.label}</h3>
                      </div>
                      <ul className="divide-y divide-dashed divide-line">
                        {items.map((s) => (
                          <li key={s.id}>
                            <Link to={`/book?service=${s.id}&step=2`} className="group flex items-center justify-between gap-3 py-3">
                              <span className="min-w-0">
                                <span className="block font-medium transition-colors group-hover:text-orchid-600 dark:group-hover:text-iris-300">{s.name}</span>
                                <span className="text-xs text-muted">{formatDuration(s.durationMin)}</span>
                              </span>
                              <span className="shrink-0 text-sm font-semibold">{formatPrice(s.price)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const { data: staff } = useStaff();
  const { data: services } = useServices();

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle kicker="تیم ما" title="دست‌های هنرمند ولورا" text="هر کدام از همکاران ما در تخصص خود سال‌ها تجربه و آموزش بین‌المللی دارند." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {!staff || !services
            ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-72" />)
            : staff
                .filter((s) => s.active)
                .map((person, i) => (
                  <motion.div key={person.id} variants={rise} custom={i} {...inView} whileHover={{ y: -6 }}>
                    <Card className="h-full overflow-hidden text-center">
                      <div className="relative h-24 bg-gradient-to-br from-orchid-100 via-mist to-iris-100 dark:from-night-700 dark:via-night-800 dark:to-night-900">
                        <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 70% 20%, ${person.avatar}55, transparent 60%)` }} />
                      </div>
                      <Avatar staff={person} className="relative mx-auto -mt-10 size-20 text-xl ring-4" />
                      <div className="p-5 pt-3">
                        <h3 className="text-lg font-bold">{person.name}</h3>
                        <p className="text-sm text-iris-600 dark:text-iris-300">{person.title}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                          {person.serviceIds.slice(0, 3).map((id) => (
                            <span key={id} className="rounded-full bg-elevated px-2.5 py-1 text-xs text-muted">
                              {services.find((s) => s.id === id)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
        </div>
      </div>
    </section>
  );
}

// Placeholder "photos": soft abstract compositions standing in for real salon shots.
const gallery = [
  { title: "بالیاژ عسلی", tag: "رنگ مو", bg: "radial-gradient(circle at 30% 25%, #ffd6ec, transparent 50%), radial-gradient(circle at 75% 80%, #a685ff, transparent 55%), linear-gradient(160deg, #f72f90, #8b5cf6)", span: "md:row-span-2" },
  { title: "کاشت ناخن نود", tag: "ناخن", bg: "radial-gradient(circle at 60% 40%, #ffffff, transparent 50%), linear-gradient(135deg, #ff98cd, #c4b1ff)" },
  { title: "فضای انتظار", tag: "سالن", bg: "radial-gradient(circle at 25% 75%, #38d6f299, transparent 50%), linear-gradient(200deg, #4a2394, #b80c63)" },
  { title: "شینیون مجلسی", tag: "مو", bg: "radial-gradient(circle at 50% 30%, #ffe2f1, transparent 55%), linear-gradient(120deg, #ff5fae, #7a3ff0)", span: "md:col-span-2" },
  { title: "اتاق مراقبت پوست", tag: "پوست", bg: "radial-gradient(circle at 70% 30%, #ffffffcc, transparent 45%), linear-gradient(160deg, #7ee8fa, #c4b1ff)" },
  { title: "ابزار حرفه‌ای", tag: "سالن", bg: "radial-gradient(circle at 40% 60%, #ff5fae, transparent 50%), linear-gradient(135deg, #1c1538, #6a2edb)" },
];

function Gallery() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle kicker="گالری" title="نمونه‌ای از کارهای ما" />
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[220px] md:grid-flow-dense md:grid-cols-4">
          {gallery.map((item, i) => (
            <motion.figure
              key={item.title}
              variants={rise}
              custom={i}
              {...inView}
              className={cn("group relative overflow-hidden rounded-3xl shadow-soft", item.span, i === 0 && "col-span-2 md:col-span-1")}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: item.bg }} />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence baseFrequency=%220.8%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.25%22/%3E%3C/svg%3E')] mix-blend-overlay" />
              <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/20 px-3 py-2 text-sm text-white backdrop-blur-md">
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-white/80">{item.tag}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">تصاویر نمایشی هستند</p>
      </div>
    </section>
  );
}

function Visit() {
  const hours = [
    ["شنبه تا چهارشنبه", "۱۰:۰۰ تا ۲۰:۰۰"],
    ["پنجشنبه", "۱۰:۰۰ تا ۲۰:۰۰"],
    ["جمعه", "تعطیل"],
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle kicker="مراجعه" title="منتظر دیدارتان هستیم" />
        <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <motion.div variants={rise} {...inView}>
            <Card className="h-full space-y-6 p-6 sm:p-8">
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Clock3 className="size-5 text-orchid-500 dark:text-iris-300" aria-hidden />
                  ساعات کاری
                </h3>
                <dl className="space-y-2 text-sm">
                  {hours.map(([day, time]) => (
                    <div key={day} className="flex justify-between border-b border-dashed border-line pb-2">
                      <dt className="text-muted">{day}</dt>
                      <dd className={cn("font-medium", time === "تعطیل" && "text-orchid-500")}>{time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <a href={SALON.phoneHref} className="flex items-center gap-3 hover:text-orchid-600 dark:hover:text-iris-300">
                <Phone className="size-5 text-orchid-500 dark:text-iris-300" aria-hidden />
                <span dir="ltr" className="font-medium">{SALON.phone}</span>
              </a>
              <p className="flex items-start gap-3 leading-7">
                <MapPin className="mt-1 size-5 shrink-0 text-orchid-500 dark:text-iris-300" aria-hidden />
                {SALON.address}
              </p>
              <a href={SALON.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-orchid-600 dark:hover:text-iris-300">
                <InstagramIcon className="size-5 text-orchid-500 dark:text-iris-300" />
                <span dir="ltr" className="font-medium">@velora.salon</span>
              </a>
            </Card>
          </motion.div>

          <motion.div variants={rise} custom={1} {...inView}>
            <MapPlaceholder />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MapPlaceholder() {
  return (
    <div className="relative h-full min-h-72 overflow-hidden rounded-3xl border border-line bg-[#f1ecfb] shadow-soft dark:bg-night-800" role="img" aria-label="نقشه موقعیت سالن (نمایشی)">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-white dark:text-night-700" aria-hidden>
        <rect x="250" y="20" width="120" height="90" rx="14" className="fill-[#d9f5e8] dark:fill-[#1d3b37]" />
        <g stroke="currentColor" strokeLinecap="round" fill="none">
          <path d="M-10 190 L410 150" strokeWidth="18" />
          <path d="M140 -10 L190 310" strokeWidth="14" />
          <path d="M-10 80 L260 120 L410 60" strokeWidth="8" />
          <path d="M60 310 L120 170 L300 300" strokeWidth="6" />
          <path d="M300 -10 L280 310" strokeWidth="6" />
        </g>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center">
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-primary-fg shadow-soft">ولورا</span>
          <MapPin className="mt-1 size-9 fill-orchid-500 text-white dark:fill-iris-300 dark:text-night-900" />
        </motion.div>
      </div>
      <span className="absolute bottom-3 start-3 glass-thin rounded-full border px-3 py-1 text-xs text-muted">نقشه نمایشی</span>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <motion.div
        variants={rise}
        {...inView}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl bg-gradient-to-br from-iris-600 via-orchid-500 to-orchid-400 px-6 py-14 text-center text-white shadow-glow sm:py-20"
      >
        <div className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-aqua-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-orchid-400/30 blur-3xl" />
        <h2 className="relative text-3xl font-bold sm:text-4xl">آماده‌اید کمی به خودتان برسید؟</h2>
        <p className="relative mx-auto mt-4 max-w-md leading-8 text-white/85">
          زمان دلخواهتان را انتخاب کنید؛ بقیه‌اش با ما. رزرو آنلاین در {toFa(4)} قدم ساده.
        </p>
        <Link
          to="/book"
          className="relative mt-8 inline-flex h-14 items-center gap-2 glass rounded-2xl px-8 font-semibold text-white transition hover:brightness-110 [--glass-tint:rgb(255_255_255/0.22)] [--glass-edge:rgb(255_255_255/0.5)]"
        >
          <CalendarHeart className="size-5" aria-hidden />
          رزرو نوبت
        </Link>
      </motion.div>
    </section>
  );
}
