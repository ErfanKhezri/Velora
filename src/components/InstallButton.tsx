import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { isStandalone, isTauri } from "../lib/platform";
import { Button } from "./ui/Button";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallButton() {
  const [event, setEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isTauri || isStandalone || !event) return null;

  async function install() {
    await event!.prompt();
    await event!.userChoice;
    setEvent(null);
  }

  return (
    <Button variant="secondary" onClick={install}>
      <Download className="size-4" aria-hidden />
      نصب اپلیکیشن
    </Button>
  );
}
