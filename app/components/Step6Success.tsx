"use client";

import React, { useEffect, useState } from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  HeartPulse,
  CreditCard,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";

export function Step6Success() {
  const { formData, branchName, resetForm } = useKioskStore();
  const [countdown, setCountdown] = useState(15);

  const fullName =
    `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim() ||
    "Valued Patient";

  // Trigger confetti burst on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#6366f1", "#f59e0b"],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // 15-second countdown timer to reset kiosk for next patient
  useEffect(() => {
    if (countdown <= 0) {
      resetForm();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, resetForm]);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-7 py-4 sm:py-8 px-4 animate-in fade-in zoom-in-95 duration-500">
      {/* Animated Glowing Icon */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 size-28 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        <div className="relative size-24 sm:size-28 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/30">
          <CheckCircle2 className="size-14 sm:size-16 stroke-[2.5]" />
        </div>
      </div>

      {/* Greeting */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          Check-In Successfully Received
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Thank you, {fullName}!
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your check-in has been sent to our front-desk reception. Please take a comfortable seat in our waiting lounge.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-[#17233d] bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-6 text-left shadow-xl space-y-3 max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#1b2946]">
          <span className="font-semibold text-slate-300">Intake Details</span>
          <span className="flex items-center gap-1 text-blue-400">
            <Calendar className="size-3.5" />
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-slate-500" />
              Branch Station
            </span>
            <span className="font-medium text-white">{branchName || "Main Clinic"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="size-3.5 text-slate-500" />
              Chief Concern
            </span>
            <span className="font-medium text-blue-300 truncate max-w-[180px]">
              {formData.visitReason.selectedChips.join(", ") ||
                formData.visitReason.chiefComplaint ||
                "Consultation"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CreditCard className="size-3.5 text-slate-500" />
              Payment Category
            </span>
            <span className="font-medium text-white">
              {formData.hmo.hasHmo
                ? `HMO (${formData.hmo.provider || "Insurance"})`
                : "Self-Pay / Cash / Card"}
            </span>
          </div>
        </div>
      </div>

      {/* Waiting Guidance */}
      <div className="rounded-2xl bg-blue-950/30 border border-blue-800/40 p-4 text-xs sm:text-sm text-blue-200/90 leading-relaxed max-w-lg mx-auto">
        🔔 Our receptionist will call your name as soon as your chart is reviewed and your dental chair is ready.
      </div>

      {/* Countdown & Reset Controls */}
      <div className="pt-2 space-y-4">
        <p className="text-xs text-slate-400">
          This kiosk station will automatically reset in{" "}
          <span className="font-bold text-blue-400 text-sm">{countdown}</span> seconds for the next patient.
        </p>

        <Button
          onClick={resetForm}
          className="h-12 px-8 text-sm font-bold bg-[#0b1325] hover:bg-slate-800 text-white rounded-xl border border-[#1b2946] shadow-md active:scale-95 transition-all"
        >
          <RotateCcw className="size-4 mr-2 text-blue-400" />
          Check-In Another Patient Now
        </Button>
      </div>
    </div>
  );
}
