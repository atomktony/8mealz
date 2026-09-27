"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { PilotSignupForm } from "./forms/PilotSignupForm";

export function PilotModal() {
  const { t } = useLang();
  const { pilotOpen, setPilotOpen } = useStore();

  useEffect(() => {
    if (!pilotOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPilotOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [pilotOpen, setPilotOpen]);

  if (!pilotOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="pilot-modal-title">
      <div className="fixed inset-0 bg-brand-ink/60" onClick={() => setPilotOpen(false)} />
      <div className="relative z-10 my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button onClick={() => setPilotOpen(false)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-brand-cream" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <p className="eyebrow text-brand-red">{t.signup.eyebrow}</p>
        <h2 id="pilot-modal-title" className="h-display mt-1 text-2xl text-brand-deep">{t.signup.title}</h2>
        <p className="mb-6 mt-2 text-sm text-slate-600">{t.signup.sub}</p>
        <PilotSignupForm source="modal" />
      </div>
    </div>
  );
}
