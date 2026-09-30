"use client";

import React, { useState, useEffect } from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Sun,
  Moon,
  RotateCcw,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KioskSettingsModal } from "@/app/components/KioskSettingsModal";
import { useTheme } from "next-themes";

interface KioskHeaderProps {
  onOpenSettings?: () => void;
}

export function KioskHeader({ onOpenSettings }: KioskHeaderProps) {
  const {
    branchName,
    isOnline,
    offlineQueueCount,
    currentStep,
    resetForm,
  } = useKioskStore();

  const { resolvedTheme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSettingsClick = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      setSettingsOpen(true);
    }
  };

  return (
    <>
      <header className="w-full border-b border-[#17233d] bg-[#070b16]/95 backdrop-blur-xl px-4 sm:px-8 py-3 sticky top-0 z-40 flex items-center justify-between shadow-lg shadow-black/40">
        {/* Left Side: Clinic Branding & Status Badge */}
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
            <Sparkles className="size-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Tabasan Dental Clinic
              </h1>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40">
                Self-Service Kiosk
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="size-3 text-blue-400 shrink-0" />
              <span className="font-medium text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                {branchName || "Main Clinic"}
              </span>
            </p>
          </div>

          {/* Online/Offline Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-[#051a14] border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-sm">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] whitespace-nowrap">
              {isOnline ? "Cloud Synced" : "Offline Mode"}
            </span>
            {offlineQueueCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px] border border-amber-500/40 ml-1">
                {offlineQueueCount} Queued
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Live Date, Live Time, Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Today's Date Widget */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#1b2946] bg-[#0b1325]/90">
            <Calendar className="size-4 text-blue-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase leading-none">
                TODAY&apos;S DATE
              </span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 leading-none">
                {mounted ? currentDate || "September 30, 2026" : "Loading..."}
              </span>
            </div>
          </div>

          {/* Current Time Widget with live seconds */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#1b2946] bg-[#0b1325]/90">
            <Clock className="size-4 text-indigo-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase leading-none">
                CURRENT TIME
              </span>
              <span className="text-xs font-mono font-bold text-white mt-0.5 leading-none tracking-wide">
                {mounted ? currentTime || "8:37:55 AM" : "--:--:--"}
              </span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hidden sm:flex size-9 items-center justify-center rounded-xl border border-[#1b2946] bg-[#0b1325] text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-[#101b33] transition-all"
            title="Toggle Theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-blue-400" />
            )}
          </button>

          {/* Reset / Start Over Button */}
          {currentStep > 1 && currentStep < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetConfirmOpen(true)}
              className="text-xs h-9 border-[#1b2946] bg-[#0b1325] hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <RotateCcw className="size-3.5 mr-1 text-slate-400" />
              <span className="hidden md:inline">Start Over</span>
            </Button>
          )}

          {/* Staff Lock PIN Button */}
          <button
            type="button"
            onClick={handleSettingsClick}
            className="flex size-9 items-center justify-center rounded-xl border border-[#1b2946] bg-[#0b1325] text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-[#101b33] transition-all"
            title="Clinic Staff Settings (PIN Required)"
          >
            <Lock className="size-4" />
          </button>
        </div>
      </header>

      {/* Admin Settings Dialog */}
      <KioskSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Start Over Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-[#1b2946] bg-[#0b1325] p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
              <ShieldAlert className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Start Over?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This will clear all filled information and return to the first check-in screen.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11 border-slate-700 bg-slate-800/50 text-slate-300"
                onClick={() => setResetConfirmOpen(false)}
              >
                Continue Intake
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-medium"
                onClick={() => {
                  resetForm();
                  setResetConfirmOpen(false);
                }}
              >
                Yes, Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
