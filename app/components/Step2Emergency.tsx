"use client";

import React from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Phone,
  User,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RELATIONSHIPS = [
  "Parent",
  "Spouse",
  "Sibling",
  "Child",
  "Relative",
  "Friend",
  "Guardian",
];

const LAST_DENTAL_VISIT_OPTIONS = [
  { id: "under_6_months", label: "Less than 6 months ago" },
  { id: "6_to_12_months", label: "6 to 12 months ago" },
  { id: "over_1_year", label: "More than 1 year ago" },
  { id: "never", label: "First time at a dental clinic" },
];

const CHIEF_COMPLAINTS = [
  { id: "toothache", label: "Toothache / Pain", sub: "Masakit ang ngipin", icon: "🦷" },
  { id: "cleaning", label: "Teeth Cleaning", sub: "Oral Prophylaxis / Linis", icon: "✨" },
  { id: "extraction", label: "Tooth Extraction", sub: "Bunot", icon: "🪥" },
  { id: "filling", label: "Dental Filling", sub: "Pasta / Restoration", icon: "🩹" },
  { id: "braces", label: "Braces / Ortho", sub: "Adjustment / Consultation", icon: "😬" },
  { id: "checkup", label: "Routine Checkup", sub: "General Dental Exam", icon: "🔍" },
  { id: "whitening", label: "Teeth Whitening", sub: "Cosmetic Bleaching", icon: "💎" },
  { id: "dentures", label: "Dentures", sub: "Pustiso / Prostho", icon: "🦷" },
  { id: "bleeding_gums", label: "Bleeding Gums", sub: "Periodontal concern", icon: "🩸" },
  { id: "broken_tooth", label: "Broken Tooth", sub: "Chipped / Emergency", icon: "🚨" },
];

export function Step2Emergency() {
  const {
    formData,
    updateEmergencyContact,
    updateVisitReason,
    nextStep,
    prevStep,
  } = useKioskStore();

  const emergency = formData.emergencyContact;
  const visit = formData.visitReason;

  const toggleChip = (label: string) => {
    const current = visit.selectedChips || [];
    if (current.includes(label)) {
      updateVisitReason({
        selectedChips: current.filter((c) => c !== label),
      });
    } else {
      updateVisitReason({
        selectedChips: [...current, label],
      });
    }
  };

  const isFormValid =
    emergency.name.trim().length > 0 &&
    emergency.contactNumber.trim().length >= 10 &&
    (visit.selectedChips.length > 0 || visit.chiefComplaint.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="size-3.5 text-blue-500 dark:text-blue-400" />
          Step 2: Emergency &amp; Dental Concern
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Why are you visiting the clinic today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Select all dental concerns that apply and specify your emergency contact person.
        </p>
      </div>

      <div className="space-y-6">
        {/* Dental Visit Reason / Complaint Chips */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="size-4 text-blue-500 dark:text-blue-400" />
                Select Chief Complaint / Service Required <span className="text-blue-500 dark:text-blue-400">*</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tap on one or more options to help the dental team prepare your instruments.
              </p>
            </div>
            {visit.selectedChips.length > 0 && (
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/30 px-2.5 py-1 rounded-full">
                {visit.selectedChips.length} selected
              </span>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
            {CHIEF_COMPLAINTS.map((c) => {
              const isSelected = (visit.selectedChips || []).includes(c.label);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleChip(c.label)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all active:scale-95 select-none cursor-pointer",
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/40 shadow-sm"
                      : "bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0b1325] hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <span className="text-2xl mb-1">{c.icon}</span>
                  <span className="text-xs font-bold leading-tight line-clamp-1">
                    {c.label}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {c.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Last Dental Visit Selection */}
          <div className="pt-2 space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="size-3.5 text-blue-500 dark:text-blue-400" />
              When was your last dental visit?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {LAST_DENTAL_VISIT_OPTIONS.map((opt) => {
                const isSelected = visit.lastDentalVisit === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateVisitReason({ lastDentalVisit: opt.label })}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-medium text-left transition-all active:scale-95 cursor-pointer",
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-900 dark:text-white shadow-sm font-semibold ring-1 ring-blue-400/50"
                        : "bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pain Scale Indicator */}
          <div className="pt-2 space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Are you currently experiencing pain? (0 = None, 10 = Severe)
              </Label>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {visit.painLevel === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Smile className="size-4" /> 0 / 10 (No pain)
                  </span>
                ) : visit.painLevel <= 4 ? (
                  <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Meh className="size-4" /> {visit.painLevel} / 10 (Mild)
                  </span>
                ) : visit.painLevel <= 7 ? (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Frown className="size-4" /> {visit.painLevel} / 10 (Moderate)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="size-4" /> {visit.painLevel} / 10 (Severe)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-11 gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = visit.painLevel === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateVisitReason({ painLevel: num })}
                    className={cn(
                      "h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-bold border transition-all active:scale-90 flex items-center justify-center cursor-pointer",
                      isSelected
                        ? num === 0
                          ? "bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-500/40"
                          : num <= 4
                          ? "bg-blue-600 text-white border-blue-500 ring-2 ring-blue-500/40"
                          : num <= 7
                          ? "bg-amber-600 text-white border-amber-500 ring-2 ring-amber-500/40"
                          : "bg-rose-600 text-white border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-600/30"
                        : "bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                    )}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Additional Details / Description (Optional)
            </Label>
            <textarea
              rows={2}
              placeholder="e.g. Upper right molar has sharp pain when drinking cold water since yesterday..."
              value={visit.chiefComplaint}
              onChange={(e) => updateVisitReason({ chiefComplaint: e.target.value })}
              className="w-full rounded-xl bg-slate-50 dark:bg-[#040813] border border-slate-200 dark:border-[#1b2946] p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="size-4 text-blue-500 dark:text-blue-400" />
              Emergency Contact Person <span className="text-blue-500 dark:text-blue-400">*</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Someone we can notify in case of urgent medical concerns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Contact Full Name <span className="text-blue-500 dark:text-blue-400">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
                <Input
                  required
                  placeholder="e.g. Maria Dela Cruz"
                  value={emergency.name}
                  onChange={(e) =>
                    updateEmergencyContact({ name: e.target.value })
                  }
                  className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Emergency Phone Number <span className="text-blue-500 dark:text-blue-400">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
                <Input
                  type="tel"
                  required
                  placeholder="09XX XXX XXXX"
                  value={emergency.contactNumber}
                  onChange={(e) =>
                    updateEmergencyContact({ contactNumber: e.target.value })
                  }
                  className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 text-base"
                />
              </div>
            </div>
          </div>

          {/* Relationship Chips */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Relationship to Patient
            </Label>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIPS.map((rel) => {
                const isSelected = emergency.relationship === rel;
                return (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => updateEmergencyContact({ relationship: rel })}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-slate-50 dark:bg-[#040813] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                    )}
                  >
                    {rel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="h-12 px-6 text-sm font-semibold border-slate-200 dark:border-[#1b2946] bg-slate-100 dark:bg-[#0b1325] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={!isFormValid}
          className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          <span>Continue to HMO &amp; Coverage</span>
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
