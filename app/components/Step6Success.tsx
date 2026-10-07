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
  User,
  Shield,
} from "lucide-react";
import confetti from "canvas-confetti";

export function Step6Success() {
  const { formData, branchName, resetForm, isOnline, offlineQueueCount } =
    useKioskStore();
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          Check-In Successfully Received
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Thank you, {fullName}!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your check-in has been sent to our front-desk reception queue. Please take a comfortable seat in our waiting lounge.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-6 text-left shadow-xl space-y-3 max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-[#1b2946]">
          <span className="font-semibold text-slate-900 dark:text-slate-300">Intake Summary</span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Calendar className="size-3.5" />
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-slate-400 dark:text-slate-500" />
              Branch Station
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{branchName || "Main Clinic"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="size-3.5 text-slate-400 dark:text-slate-500" />
              Classification
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
              {formData.personalInfo.patientType === "minor"
                ? `Minor (Guardian: ${formData.personalInfo.guardianName || "Parent"})`
                : formData.personalInfo.patientType === "mentally_disabled"
                ? "Special Care / PWD"
                : "Adult Patient"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="size-3.5 text-slate-400 dark:text-slate-500" />
              Chief Concern
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-300 truncate max-w-[200px]">
              {formData.visitReason.selectedChips.join(", ") ||
                formData.visitReason.chiefComplaint ||
                "Consultation"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CreditCard className="size-3.5 text-slate-400 dark:text-slate-500" />
              Payment Category
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {formData.hmo.hasHmo
                ? `HMO (${formData.hmo.providerName || "Accredited"})`
                : "Self-Pay / Private"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#1b2946]">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Shield className="size-3.5 text-slate-400 dark:text-slate-500" />
              Transmission
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {isOnline ? "Sent Online to Reception" : "Saved Locally (Auto-Syncing)"}
            </span>
          </div>
        </div>
      </div>

      {/* Waiting Guidance */}
      <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 p-4 text-xs sm:text-sm text-blue-900 dark:text-blue-200/90 leading-relaxed max-w-lg mx-auto">
        🔔 Our receptionist will call your name as soon as your chart is reviewed and your dental chair is ready.
      </div>

      {/* Countdown & Reset Controls */}
      <div className="pt-2 space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This kiosk station will automatically reset in{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{countdown}</span> seconds for the next patient.
        </p>

        <Button
          onClick={resetForm}
          className="h-12 px-8 text-sm font-bold bg-slate-100 dark:bg-[#0b1325] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-[#1b2946] shadow-md active:scale-95 transition-all"
        >
          <RotateCcw className="size-4 mr-2 text-blue-600 dark:text-blue-400" />
          Check-In Another Patient Now
        </Button>
      </div>
    </div>
  );
}
