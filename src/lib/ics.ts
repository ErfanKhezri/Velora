import type { AppointmentDetails } from "../api";

function stamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function downloadIcs(a: AppointmentDetails) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Velora//Booking//FA",
    "BEGIN:VEVENT",
    `UID:${a.id}@velora.app`,
    `DTSTAMP:${stamp(a.createdAt)}`,
    `DTSTART:${stamp(a.startsAt)}`,
    `DTEND:${stamp(a.endsAt)}`,
    `SUMMARY:${a.service.name} — سالن ولورا`,
    `DESCRIPTION:متخصص: ${a.staff.name}`,
    "LOCATION:تهران، خیابان ولیعصر، کوچه نیلوفر، پلاک ۱۲",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "velora-appointment.ics";
  link.click();
  URL.revokeObjectURL(url);
}
