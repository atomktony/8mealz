"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export function PilotBar() {
  const { t } = useLang();
  return (
    <div className="bg-brand-deep text-white text-[11px] sm:text-xs text-center px-4 py-2">
      <Link href="/pilot-disclosure" className="hover:underline">
        {t.pilotBar}
      </Link>
    </div>
  );
}
