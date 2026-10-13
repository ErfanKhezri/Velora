export type Category = "hair" | "color" | "nails" | "skin" | "makeup";

export type Service = {
  id: string;
  name: string;
  category: Category;
  durationMin: number;
  price: number; // toman
  description: string;
  active: boolean;
};

export type Staff = {
  id: string;
  name: string;
  title: string;
  avatar: string; // accent color for the initials avatar
  serviceIds: string[];
  active: boolean;
};

export type WorkingHour = {
  staffId: string;
  weekday: number; // 0 = Saturday … 6 = Friday
  startMin: number;
  endMin: number;
};

export type TimeOff = {
  id: string;
  staffId: string | null; // null = whole salon closed
  startsAt: string;
  endsAt: string;
  reason?: string;
};

export type Customer = { id: string; phone: string; name: string };

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "done";

export type Appointment = {
  id: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  note?: string;
  createdAt: string;
};

export type Settings = { slotInterval: 15 | 30 };

export type Db = {
  version: number;
  services: Service[];
  staff: Staff[];
  workingHours: WorkingHour[];
  timeOff: TimeOff[];
  customers: Customer[];
  appointments: Appointment[];
  settings: Settings;
};

/** A free start time and the staff members who can take it. */
export type Slot = { startMin: number; staffIds: string[] };

export type DayStatus = "open" | "full" | "closed" | "past";

/** Appointment joined with its customer, service and staff for display. */
export type AppointmentDetails = Appointment & {
  customer: Customer;
  service: Service;
  staff: Staff;
};

export type NewAppointment = {
  serviceId: string;
  staffId: string | null; // null = any available staff
  date: string; // YYYY-MM-DD
  startMin: number;
  customerId: string;
  note?: string;
};
