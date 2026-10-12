import { atMinutes, dayjs, startOfWeek, today } from "../lib/date";
import type { Appointment, Customer, Db, Service, Staff, TimeOff, WorkingHour } from "./types";

const services: Service[] = [
  { id: "haircut", name: "کوتاهی و فرم‌دهی مو", category: "hair", durationMin: 45, price: 450_000, description: "مشاوره فرم صورت، شست‌وشو و کوتاهی تخصصی", active: true },
  { id: "blowdry", name: "براشینگ و حالت‌دهی", category: "hair", durationMin: 45, price: 350_000, description: "حالت‌دهی نرم و براق برای هر روز", active: true },
  { id: "updo", name: "شینیون مجلسی", category: "hair", durationMin: 90, price: 1_800_000, description: "شینیون باز یا بسته متناسب با استایل شما", active: true },
  { id: "keratin", name: "کراتینه مو", category: "hair", durationMin: 180, price: 3_500_000, description: "صاف و درخشان، با محصولات بدون فرمالدئید", active: true },
  { id: "root-color", name: "رنگ ریشه", category: "color", durationMin: 90, price: 1_200_000, description: "پوشش کامل ریشه با رنگ‌های گیاهی", active: true },
  { id: "balayage", name: "بالیاژ", category: "color", durationMin: 240, price: 6_500_000, description: "روشن‌سازی دست‌آزاد با گذار طبیعی رنگ", active: true },
  { id: "highlight", name: "هایلایت", category: "color", durationMin: 180, price: 4_200_000, description: "لایت ظریف برای عمق و درخشش بیشتر", active: true },
  { id: "manicure", name: "مانیکور", category: "nails", durationMin: 45, price: 400_000, description: "فرم‌دهی، کوتیکول و لاک", active: true },
  { id: "pedicure", name: "پدیکور اسپا", category: "nails", durationMin: 60, price: 550_000, description: "پدیکور با ماسک و ماساژ آرامش‌بخش", active: true },
  { id: "gel-nails", name: "کاشت ناخن ژل", category: "nails", durationMin: 120, price: 1_400_000, description: "کاشت ظریف و ماندگار با طراحی دلخواه", active: true },
  { id: "deep-clean", name: "پاکسازی عمیق پوست", category: "skin", durationMin: 75, price: 1_300_000, description: "لایه‌برداری، پاکسازی و ماسک تخصصی", active: true },
  { id: "hydrafacial", name: "فیشیال آبرسان", category: "skin", durationMin: 60, price: 1_100_000, description: "آبرسانی عمیق و درخشش فوری پوست", active: true },
  { id: "party-makeup", name: "میکاپ مجلسی", category: "makeup", durationMin: 90, price: 2_500_000, description: "میکاپ ماندگار و متناسب با لباس", active: true },
  { id: "bridal", name: "میکاپ و شینیون عروس", category: "makeup", durationMin: 180, price: 9_000_000, description: "پکیج کامل عروس با مشاوره و تست قبلی", active: true },
];

const staff: Staff[] = [
  { id: "sara", name: "سارا محمدی", title: "استایلیست ارشد مو", avatar: "#c97770", serviceIds: ["haircut", "blowdry", "updo", "keratin"], active: true },
  { id: "negar", name: "نگار رحیمی", title: "متخصص رنگ و لایت", avatar: "#b8924f", serviceIds: ["root-color", "balayage", "highlight", "haircut"], active: true },
  { id: "maryam", name: "مریم کاظمی", title: "متخصص ناخن", avatar: "#9a7189", serviceIds: ["manicure", "pedicure", "gel-nails"], active: true },
  { id: "leila", name: "لیلا احمدی", title: "متخصص پوست و میکاپ", avatar: "#7f8f86", serviceIds: ["deep-clean", "hydrafacial", "party-makeup", "bridal", "updo"], active: true },
];

// [staffId, weekdays, startMin, endMin]
const schedule: [string, number[], number, number][] = [
  ["sara", [0, 1, 2, 3, 4], 600, 1140],
  ["negar", [1, 2, 3, 4, 5], 720, 1200],
  ["maryam", [0, 1, 2, 4, 5], 600, 1080],
  ["leila", [0, 2, 4, 5], 660, 1200],
];

const customers: Customer[] = [
  { id: "c1", name: "نازنین رضایی", phone: "09121234567" },
  { id: "c2", name: "الهام کریمی", phone: "09351112233" },
  { id: "c3", name: "ترانه موسوی", phone: "09194445566" },
  { id: "c4", name: "شیما نوری", phone: "09367778899" },
  { id: "c5", name: "آیدا صالحی", phone: "09125550011" },
  { id: "c6", name: "پریسا جعفری", phone: "09033332211" },
];

// [weekday, staffId, serviceId, startMin, customerId]
const bookings: [number, string, string, number, string][] = [
  [0, "sara", "haircut", 630, "c1"],
  [0, "maryam", "manicure", 660, "c2"],
  [0, "leila", "deep-clean", 720, "c3"],
  [1, "sara", "keratin", 600, "c4"],
  [1, "negar", "root-color", 780, "c5"],
  [1, "maryam", "pedicure", 900, "c6"],
  [2, "sara", "blowdry", 960, "c2"],
  [2, "leila", "party-makeup", 1020, "c1"],
  [2, "maryam", "gel-nails", 600, "c3"],
  [3, "negar", "balayage", 720, "c6"],
  [3, "sara", "haircut", 840, "c5"],
  [4, "sara", "updo", 660, "c4"],
  [4, "leila", "hydrafacial", 900, "c2"],
  [4, "maryam", "manicure", 720, "c1"],
  [5, "negar", "highlight", 780, "c3"],
  [5, "leila", "bridal", 660, "c6"],
];

export function createSeed(): Db {
  const weekStart = startOfWeek(today());
  const now = dayjs();

  const workingHours: WorkingHour[] = schedule.flatMap(([staffId, days, startMin, endMin]) =>
    days.map((weekday) => ({ staffId, weekday, startMin, endMin })),
  );

  const appointments: Appointment[] = bookings.map(([weekday, staffId, serviceId, startMin, customerId], i) => {
    const date = weekStart.add(weekday, "day").format("YYYY-MM-DD");
    const start = atMinutes(date, startMin);
    const service = services.find((s) => s.id === serviceId)!;
    const isPast = start.isBefore(now);
    const status = isPast ? (i % 6 === 5 ? "cancelled" : "done") : i % 3 === 0 ? "pending" : "confirmed";
    return {
      id: `a${i + 1}`,
      customerId,
      serviceId,
      staffId,
      startsAt: start.toISOString(),
      endsAt: start.add(service.durationMin, "minute").toISOString(),
      status,
      note: i === 9 ? "اولین بار بالیاژ انجام می‌دهد؛ مشاوره رنگ قبل از شروع" : undefined,
      createdAt: weekStart.subtract(3, "day").toISOString(),
    };
  });

  const nextWeek = weekStart.add(7, "day");
  const timeOff: TimeOff[] = [
    {
      id: "t1",
      staffId: "negar",
      startsAt: nextWeek.add(2, "day").toISOString(),
      endsAt: nextWeek.add(4, "day").toISOString(),
      reason: "مرخصی",
    },
    {
      id: "t2",
      staffId: null,
      startsAt: nextWeek.add(12, "day").toISOString(),
      endsAt: nextWeek.add(13, "day").toISOString(),
      reason: "تعطیلی رسمی",
    },
  ];

  return {
    services,
    staff,
    workingHours,
    timeOff,
    customers,
    appointments,
    settings: { slotInterval: 30 },
  };
}
