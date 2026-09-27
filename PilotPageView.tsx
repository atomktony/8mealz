"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { PilotSignupForm } from "./forms/PilotSignupForm";

export function PilotPageView() {
  const { t } = useLang();
  return (
    <div className="bg-brand-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="eyebrow text-brand-red">{t.signup.eyebrow}</p>
          <h1 className="h-display mt-2 text-4xl text-brand-deep">{t.signup.title}</h1>
          <p className="mt-4 text-slate-700">{t.signup.sub}</p>
          <p className="script mt-6 text-4xl text-brand-teal-dark">{t.problem.script}</p>
          <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
            <Image src="/images/strip-grains.jpg" alt={t.photos.c} fill sizes="50vw" className="object-cover" />
          </div>
        </div>
        <div className="h-fit rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <PilotSignupForm source="page" />
        </div>
      </div>
    </div>
  );
}
