import { Brush, Flower2, Hand, Palette, Scissors, type LucideIcon } from "lucide-react";
import type { AppointmentStatus, Category } from "../api";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "hair", label: "مو" },
  { id: "color", label: "رنگ و لایت" },
  { id: "nails", label: "ناخن" },
  { id: "skin", label: "پوست" },
  { id: "makeup", label: "میکاپ" },
];

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  hair: Scissors,
  color: Palette,
  nails: Hand,
  skin: Flower2,
  makeup: Brush,
};

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<Category, string>;

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "در انتظار تأیید",
  confirmed: "تأییدشده",
  done: "انجام‌شده",
  cancelled: "لغوشده",
};

export const SALON = {
  name: "Velora",
  faName: "ولورا",
  phone: "۰۲۱-۲۲۳۴۵۶۷۸",
  phoneHref: "tel:+982122345678",
  instagram: "https://instagram.com/velora.salon",
  address: "تهران، خیابان ولیعصر، بالاتر از پارک ملت، کوچه نیلوفر، پلاک ۱۲",
  github: "https://github.com/erfankhezri/velora",
};
