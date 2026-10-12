import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { AppointmentDetails, Slot } from "../../api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useServices } from "../../hooks/useServices";
import { useStaff } from "../../hooks/useStaff";
import { toFa } from "../../lib/date";
import { BookingSummary } from "./BookingSummary";
import { StepAuth } from "./StepAuth";
import { StepDate } from "./StepDate";
import { StepDone } from "./StepDone";
import { StepService } from "./StepService";
import { StepStaff } from "./StepStaff";
import { StepTime } from "./StepTime";
import { StepProgress, STEPS } from "./StepProgress";

const TITLES = [
  "چه خدمتی می‌خواهید؟",
  "با چه کسی؟",
  "چه روزی؟",
  "چه ساعتی؟",
  "ورود و ثبت نوبت",
  "نوبت شما ثبت شد",
];

export default function BookingPage() {
  const [params, setParams] = useSearchParams();
  const [serviceId, setServiceId] = useState<string | null>(params.get("service"));
  const [staffChoice, setStaffChoice] = useState<string | null>(null); // staff id or "any"
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState<AppointmentDetails | null>(null);

  const services = useServices();
  const staff = useStaff();
  const service = services.data?.find((s) => s.id === serviceId);
  const person = staff.data?.find((s) => s.id === staffChoice);
  const staffId = staffChoice === "any" ? null : staffChoice;

  // The URL holds the requested step; never show a step whose inputs are missing.
  const firstOpen = !serviceId ? 1 : !staffChoice ? 2 : !date ? 3 : !slot ? 4 : 5;
  const step = booked ? 6 : Math.min(Number(params.get("step")) || 1, firstOpen);

  const previous = useRef(step);
  const direction = step >= previous.current ? 1 : -1;
  useEffect(() => {
    previous.current = step;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function goTo(next: number, replace = false) {
    setParams({ step: String(next) }, { replace });
  }

  function chooseService(id: string) {
    if (id !== serviceId) {
      setStaffChoice(null);
      setDate(null);
      setSlot(null);
    }
    setServiceId(id);
  }

  function chooseStaff(id: string) {
    if (id !== staffChoice) setSlot(null);
    setStaffChoice(id);
  }

  function chooseDate(d: string) {
    if (d !== date) setSlot(null);
    setDate(d);
  }

  function onBooked(appointment: AppointmentDetails) {
    setBooked(appointment);
    goTo(6, true);
  }

  function onSlotTaken() {
    setSlot(null);
    goTo(4, true);
  }

  function restart() {
    setServiceId(null);
    setStaffChoice(null);
    setDate(null);
    setSlot(null);
    setNote("");
    setBooked(null);
    goTo(1);
  }

  const canContinue = [!!serviceId, !!staffChoice, !!date, !!slot][step - 1];
  const showActions = step <= 4;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-32 sm:px-6 md:pt-10 md:pb-16">
      <StepProgress step={step} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden p-5 sm:p-8">
          <p className="text-sm text-muted">
            مرحله {toFa(step)} از {toFa(STEPS.length)}
          </p>
          <h1 className="mt-1 mb-6 text-2xl font-bold sm:text-3xl">{TITLES[step - 1]}</h1>

          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: -40 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 * direction }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <StepService services={services.data} value={serviceId} onChange={chooseService} />}
              {step === 2 && <StepStaff serviceId={serviceId!} value={staffChoice} onChange={chooseStaff} />}
              {step === 3 && <StepDate serviceId={serviceId!} staffId={staffId} value={date} onChange={chooseDate} />}
              {step === 4 && <StepTime serviceId={serviceId!} staffId={staffId} date={date!} value={slot} onChange={setSlot} onChangeDate={() => goTo(3)} />}
              {step === 5 && (
                <StepAuth
                  input={{ serviceId: serviceId!, staffId, date: date!, startMin: slot!.startMin }}
                  note={note}
                  onNoteChange={setNote}
                  onBooked={onBooked}
                  onSlotTaken={onSlotTaken}
                />
              )}
              {step === 6 && booked && <StepDone appointment={booked} onRestart={restart} />}
            </motion.div>
          </AnimatePresence>

          {showActions && (
            <div className="mt-8 hidden items-center justify-between border-t border-line pt-6 md:flex">
              <Button variant="ghost" onClick={() => goTo(step - 1)} disabled={step === 1}>
                <ArrowRight className="size-4" aria-hidden />
                قبلی
              </Button>
              <Button onClick={() => goTo(step + 1)} disabled={!canContinue} size="lg">
                ادامه
                <ArrowLeft className="size-4" aria-hidden />
              </Button>
            </div>
          )}
        </Card>

        <BookingSummary service={service} person={person} anyStaff={staffChoice === "any"} date={date} slot={slot} className="hidden lg:block" />
      </div>

      {showActions && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button variant="secondary" onClick={() => goTo(step - 1)} disabled={step === 1} aria-label="مرحله قبل" className="w-12 px-0">
              <ArrowRight className="size-5" />
            </Button>
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{service?.name ?? "خدمتی انتخاب نشده"}</p>
              <p className="truncate text-xs text-muted">{STEPS[step - 1]}</p>
            </div>
            <Button onClick={() => goTo(step + 1)} disabled={!canContinue}>
              ادامه
              <ArrowLeft className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
