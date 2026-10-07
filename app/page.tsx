"use client";

import React, { useEffect } from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { KioskHeader } from "@/app/components/KioskHeader";
import { KioskProgressBar } from "@/app/components/KioskProgressBar";
import { Step1Demographics } from "@/app/components/Step1Demographics";
import { Step2Emergency } from "@/app/components/Step2Emergency";
import { Step3Hmo } from "@/app/components/Step3Hmo";
import { Step4Medical } from "@/app/components/Step4Medical";
import { Step5Consent } from "@/app/components/Step5Consent";
import { Step6Success } from "@/app/components/Step6Success";

export default function KioskPage() {
  const {
    currentStep,
    initKiosk,
    setIsOnline,
    drainOfflineQueue,
  } = useKioskStore();

  useEffect(() => {
    // Initialize kiosk branch, Dexie queue count, and connectivity
    initKiosk();

    const handleOnline = () => {
      setIsOnline(true);
      drainOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [initKiosk, setIsOnline, drainOfflineQueue]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#060a14] text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden font-sans transition-colors duration-200">
      {/* Ambient Radial Glow Gradients */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-500/10 dark:from-blue-600/10 via-indigo-500/5 dark:via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[300px] bg-gradient-to-t from-indigo-500/10 dark:from-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Top Clinic Header */}
      <KioskHeader />

      {/* Focused Kiosk Intake Workspace */}
      <main className="relative z-10 flex-1 flex flex-col justify-start px-4 sm:px-6 py-6 sm:py-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Step Progress Tracker */}
        <KioskProgressBar />

        {/* Step Views */}
        <div className="flex-1 w-full pb-8">
          {currentStep === 1 && <Step1Demographics />}
          {currentStep === 2 && <Step2Emergency />}
          {currentStep === 3 && <Step3Hmo />}
          {currentStep === 4 && <Step4Medical />}
          {currentStep === 5 && <Step5Consent />}
          {currentStep === 6 && <Step6Success />}
        </div>
      </main>

      {/* Minimal Clinic Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-[#17233d] bg-white/80 dark:bg-[#070c18]/80 py-3.5 text-center text-xs text-slate-500 dark:text-slate-400 backdrop-blur-md transition-colors">
        <p>
          Tabasan Dental Clinic &copy; {new Date().getFullYear()} &bull; Patient Self-Service Kiosk &bull; Powered by Dexie Offline &amp; Appwrite
        </p>
      </footer>
    </div>
  );
}
