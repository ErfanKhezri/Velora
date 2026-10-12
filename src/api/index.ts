// The only module pages (via hooks) use to reach data.
// To connect a real backend, replace these mock calls with `fetch` requests.
import { atMinutes, dayjs } from "../lib/date";
import { getDayStatus, getSlots } from "../lib/availability";
import { delay, onExternalChange, readDb, resetDb, uid, writeDb } from "./mockDb";
import type {
  Appointment,
  AppointmentDetails,
  Customer,
  DayStatus,
  Db,
  NewAppointment,
  Service,
  Settings,
  Staff,
  TimeOff,
  WorkingHour,
} from "./types";

export * from "./types";
export { onExternalChange };

const DEMO_OTP = "1234";

function withDetails(db: Db, a: Appointment): AppointmentDetails {
  // A deleted service still shows up in past appointments.
  const removedService: Service = {
    id: a.serviceId,
    name: "خدمت حذف‌شده",
    category: "hair",
    durationMin: dayjs(a.endsAt).diff(a.startsAt, "minute"),
    price: 0,
    description: "",
    active: false,
  };
  return {
    ...a,
    customer: db.customers.find((c) => c.id === a.customerId)!,
    service: db.services.find((s) => s.id === a.serviceId) ?? removedService,
    staff: db.staff.find((s) => s.id === a.staffId)!,
  };
}

function byStart(a: Appointment, b: Appointment) {
  return a.startsAt.localeCompare(b.startsAt);
}

/* ---------- Public catalog ---------- */

export async function getServices() {
  await delay();
  return readDb().services;
}

export async function getStaff(serviceId?: string) {
  await delay();
  const staff = readDb().staff;
  return serviceId ? staff.filter((s) => s.active && s.serviceIds.includes(serviceId)) : staff;
}

export async function getWorkingHours() {
  await delay();
  return readDb().workingHours;
}

export async function getTimeOff() {
  await delay();
  return readDb().timeOff;
}

export async function getSettings() {
  await delay();
  return readDb().settings;
}

/* ---------- Availability ---------- */

export async function getAvailability(
  serviceId: string,
  staffId: string | null,
  date: string,
  ignoreAppointmentId?: string,
) {
  await delay();
  return getSlots(readDb(), serviceId, staffId, date, ignoreAppointmentId);
}

export async function getDayStatuses(serviceId: string, staffId: string | null, dates: string[]) {
  await delay();
  const db = readDb();
  const result: Record<string, DayStatus> = {};
  for (const date of dates) result[date] = getDayStatus(db, serviceId, staffId, date);
  return result;
}

/* ---------- Customer auth ---------- */

export async function requestOtp(phone: string) {
  await delay();
  return { phone, demoCode: DEMO_OTP };
}

/** Returns the customer, or null when this phone is new and needs a name. */
export async function verifyOtp(phone: string, code: string) {
  await delay();
  if (code !== DEMO_OTP) throw new Error("کد واردشده درست نیست");
  return readDb().customers.find((c) => c.phone === phone) ?? null;
}

export async function createCustomer(phone: string, name: string) {
  await delay();
  const db = readDb();
  const existing = db.customers.find((c) => c.phone === phone);
  if (existing) return existing;
  const customer: Customer = { id: uid(), phone, name };
  db.customers.push(customer);
  writeDb(db);
  return customer;
}

export async function searchCustomers(query: string) {
  await delay();
  const q = query.trim();
  if (!q) return [];
  return readDb()
    .customers.filter((c) => c.name.includes(q) || c.phone.includes(q))
    .slice(0, 8);
}

/* ---------- Booking ---------- */

function insertAppointment(input: NewAppointment, status: Appointment["status"]) {
  const db = readDb();
  const service = db.services.find((s) => s.id === input.serviceId)!;
  const slot = getSlots(db, input.serviceId, input.staffId, input.date).find((s) => s.startMin === input.startMin);
  if (!slot) throw new Error("متأسفانه این زمان همین حالا رزرو شد. لطفاً زمان دیگری انتخاب کنید.");

  const start = atMinutes(input.date, input.startMin);
  const appointment: Appointment = {
    id: uid(),
    customerId: input.customerId,
    serviceId: input.serviceId,
    staffId: slot.staffIds[0],
    startsAt: start.toISOString(),
    endsAt: start.add(service.durationMin, "minute").toISOString(),
    status,
    note: input.note || undefined,
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(appointment);
  writeDb(db);
  return withDetails(db, appointment);
}

export async function createAppointment(input: NewAppointment) {
  await delay();
  return insertAppointment(input, "pending");
}

export async function getMyAppointments(customerId: string) {
  await delay();
  const db = readDb();
  return db.appointments
    .filter((a) => a.customerId === customerId)
    .sort(byStart)
    .map((a) => withDetails(db, a));
}

export async function cancelMyAppointment(id: string) {
  return updateAppointment(id, { status: "cancelled" });
}

/* ---------- Admin ---------- */

export async function adminLogin(username: string, password: string) {
  await delay();
  if (username !== "admin" || password !== "velora") throw new Error("نام کاربری یا رمز عبور اشتباه است");
  return true;
}

/** Appointments whose start falls in [from, to) — dates as YYYY-MM-DD. */
export async function getAppointments(from: string, to: string, staffId?: string) {
  await delay();
  const db = readDb();
  const start = dayjs(from).startOf("day");
  const end = dayjs(to).startOf("day");
  return db.appointments
    .filter((a) => {
      const t = dayjs(a.startsAt);
      return !t.isBefore(start) && t.isBefore(end) && (!staffId || a.staffId === staffId);
    })
    .sort(byStart)
    .map((a) => withDetails(db, a));
}

export async function updateAppointment(id: string, patch: Partial<Pick<Appointment, "status" | "note">>) {
  await delay();
  const db = readDb();
  const appointment = db.appointments.find((a) => a.id === id)!;
  Object.assign(appointment, patch);
  writeDb(db);
  return withDetails(db, appointment);
}

export async function rescheduleAppointment(id: string, date: string, startMin: number) {
  await delay();
  const db = readDb();
  const appointment = db.appointments.find((a) => a.id === id)!;
  const free = getSlots(db, appointment.serviceId, appointment.staffId, date, id).some((s) => s.startMin === startMin);
  if (!free) throw new Error("این زمان برای این متخصص آزاد نیست");

  const service = db.services.find((s) => s.id === appointment.serviceId)!;
  const start = atMinutes(date, startMin);
  appointment.startsAt = start.toISOString();
  appointment.endsAt = start.add(service.durationMin, "minute").toISOString();
  writeDb(db);
  return withDetails(db, appointment);
}

export async function adminCreateAppointment(input: NewAppointment) {
  await delay();
  return insertAppointment(input, "confirmed");
}

export async function saveService(service: Omit<Service, "id"> & { id?: string }) {
  await delay();
  const db = readDb();
  const existing = db.services.find((s) => s.id === service.id);
  if (existing) Object.assign(existing, service);
  else db.services.push({ ...service, id: uid() });
  writeDb(db);
}

export async function deleteService(id: string) {
  await delay();
  const db = readDb();
  db.services = db.services.filter((s) => s.id !== id);
  for (const person of db.staff) person.serviceIds = person.serviceIds.filter((sid) => sid !== id);
  writeDb(db);
}

export async function saveStaff(person: Omit<Staff, "id"> & { id?: string }) {
  await delay();
  const db = readDb();
  const existing = db.staff.find((s) => s.id === person.id);
  if (existing) Object.assign(existing, person);
  else db.staff.push({ ...person, id: uid() });
  writeDb(db);
}

export async function saveWorkingHours(staffId: string, hours: Omit<WorkingHour, "staffId">[]) {
  await delay();
  const db = readDb();
  db.workingHours = [
    ...db.workingHours.filter((h) => h.staffId !== staffId),
    ...hours.map((h) => ({ ...h, staffId })),
  ];
  writeDb(db);
}

export async function addTimeOff(timeOff: Omit<TimeOff, "id">) {
  await delay();
  const db = readDb();
  db.timeOff.push({ ...timeOff, id: uid() });
  writeDb(db);
}

export async function deleteTimeOff(id: string) {
  await delay();
  const db = readDb();
  db.timeOff = db.timeOff.filter((t) => t.id !== id);
  writeDb(db);
}

export async function updateSettings(settings: Settings) {
  await delay();
  const db = readDb();
  db.settings = settings;
  writeDb(db);
}

export async function resetDemo() {
  await delay();
  resetDb();
}
