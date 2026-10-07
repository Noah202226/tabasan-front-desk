"use client";

import React from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Check, User, HeartPulse, CreditCard, Activity, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { step: 1, label: "Personal", fullLabel: "Personal Details", icon: User },
  { step: 2, label: "Concern", fullLabel: "Chief Concern", icon: HeartPulse },
  { step: 3, label: "Coverage", fullLabel: "HMO / Coverage", icon: CreditCard },
  { step: 4, label: "Screening", fullLabel: "Health Screening", icon: Activity },
  { step: 5, label: "Consent", fullLabel: "Consent & Sign", icon: PenLine },
];

export function KioskProgressBar() {
  const { currentStep } = useKioskStore();

  // Hide progress bar on success screen (step 6)
  if (currentStep === 6) return null;

  return (
    <div className="w-full px-2 py-3 sm:py-4">
      <div className="relative">
        {/* Track Line Background */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 dark:bg-[#141f36] rounded-full -z-0" />

        {/* Active Progress Fill */}
        <div
          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full -z-0 transition-all duration-500 ease-out shadow-sm shadow-blue-500/50"
          style={{
            width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100))}%`,
          }}
        />

        {/* Step Nodes */}
        <div className="relative z-10 flex justify-between items-start">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const Icon = s.icon;

            return (
              <div
                key={s.step}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={cn(
                    "flex items-center justify-center size-10 sm:size-11 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ring-4 select-none",
                    isCompleted &&
                      "bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-emerald-200 dark:ring-emerald-950/60 shadow-lg shadow-emerald-500/20",
                    isCurrent &&
                      "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white ring-blue-300 dark:ring-blue-500/40 scale-110 shadow-xl shadow-indigo-600/40",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-[#1b2946] text-slate-400 dark:text-slate-500 ring-slate-100 dark:ring-black/40 shadow-sm"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="size-4 sm:size-5" />
                  )}
                </div>

                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-[11px] sm:text-xs font-semibold tracking-wide transition-colors",
                      isCurrent && "text-blue-600 dark:text-blue-400 font-bold",
                      isCompleted && "text-emerald-600 dark:text-emerald-400",
                      !isCurrent && !isCompleted && "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    <span className="sm:hidden">{s.label}</span>
                    <span className="hidden sm:inline">{s.fullLabel}</span>
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden md:block">
                    Step {s.step} of 5
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
