import dayjs, { type Dayjs } from "dayjs";
import jalaliday from "jalaliday/dayjs";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);

export { dayjs, type Dayjs };

export const WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
export const WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const faDigits = "۰۱۲۳۴۵۶۷۸۹";

export function toFa(value: string | number) {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)]);
}

/** Converts Persian/Arabic digits typed by the user to English digits. */
export function toEn(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

export function formatPrice(toman: number) {
  return `${toman.toLocaleString("fa-IR")} تومان`;
}

/** Jalali + Persian-locale view of a date. */
export function jalali(date: string | Dayjs | Date) {
  return dayjs(date).calendar("jalali").locale("fa");
}

/** 0 = Saturday … 6 = Friday */
export function weekdayOf(date: string | Dayjs) {
  return (dayjs(date).day() + 1) % 7;
}

export function today() {
  return dayjs().format("YYYY-MM-DD");
}

export function toDateKey(date: string | Dayjs | Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function minutesOfDay(date: string | Dayjs) {
  const d = dayjs(date);
  return d.hour() * 60 + d.minute();
}

export function atMinutes(date: string, minutes: number) {
  return dayjs(date).startOf("day").add(minutes, "minute");
}

export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return toFa(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

export function formatClock(date: string | Dayjs) {
  return formatTime(minutesOfDay(date));
}

/** e.g. "دوشنبه ۲۰ مهر" */
export function formatDay(date: string | Dayjs) {
  return toFa(jalali(date).format("dddd D MMMM"));
}

/** e.g. "۲۰ مهر ۱۴۰۵" */
export function formatDate(date: string | Dayjs) {
  return toFa(jalali(date).format("D MMMM YYYY"));
}

export function formatMonth(date: string | Dayjs) {
  return toFa(jalali(date).format("MMMM YYYY"));
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${toFa(m)} دقیقه`;
  if (!m) return `${toFa(h)} ساعت`;
  return `${toFa(h)} ساعت و ${toFa(m)} دقیقه`;
}

/** Gregorian date of the Saturday that starts the week containing `date`. */
export function startOfWeek(date: string | Dayjs) {
  return dayjs(date).startOf("day").subtract(weekdayOf(date), "day");
}

/** First gregorian day of the Jalali month containing `date`. */
export function startOfJalaliMonth(date: string | Dayjs) {
  const d = dayjs(date).startOf("day");
  return d.subtract(jalali(d).date() - 1, "day");
}

export function daysInJalaliMonth(date: string | Dayjs) {
  return jalali(date).daysInMonth();
}
