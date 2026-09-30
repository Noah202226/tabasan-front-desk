"use client";

import React from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Pill,
  Heart,
  Droplet,
  ShieldAlert,
  Baby,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthQuestion {
  key: string;
  title: string;
  tagalog: string;
  desc: string;
  icon: any;
  forFemaleOnly?: boolean;
}

const HEALTH_QUESTIONS: HealthQuestion[] = [
  {
    key: "hypertension",
    title: "High Blood Pressure / Hypertension",
    tagalog: "Mataas na presyon ng dugo",
    desc: "Important for local anesthetic selection (with or without epinephrine).",
    icon: Activity,
  },
  {
    key: "heartDisease",
    title: "Heart Trouble / Murmur / Pacemaker",
    tagalog: "Karamdaman sa puso",
    desc: "May require antibiotic prophylaxis prior to surgical or deep cleaning procedures.",
    icon: Heart,
  },
  {
    key: "diabetes",
    title: "Diabetes / High Blood Sugar",
    tagalog: "Diyabetes o mataas na asukal sa dugo",
    desc: "Affects tissue healing, gum inflammation, and post-extraction recovery.",
    icon: Droplet,
  },
  {
    key: "bleedingDisorder",
    title: "Bleeding Tendency / Hemophilia",
    tagalog: "Mabagal mamuo ang dugo / Madalas magpasa",
    desc: "Crucial for extractions and surgical procedures.",
    icon: Droplet,
  },
  {
    key: "bloodThinners",
    title: "Taking Blood Thinners / Aspirin / Warfarin",
    tagalog: "Umiinom ng pampalabnaw ng dugo",
    desc: "Aspirin, Clopidogrel, Warfarin, or other anticoagulants.",
    icon: Pill,
  },
  {
    key: "allergies",
    title: "Allergies to Penicillin, Anesthetics, or Latex",
    tagalog: "Allergy sa gamot, pampamanhid, o latex gloves",
    desc: "Prevents severe allergic reactions during dental anesthesia.",
    icon: ShieldAlert,
  },
  {
    key: "asthma",
    title: "Asthma or Respiratory Conditions",
    tagalog: "Hika o kahirapan sa paghinga",
    desc: "Helps us ensure quick access to your inhaler if needed.",
    icon: Activity,
  },
  {
    key: "pregnantOrNursing",
    title: "Currently Pregnant or Breastfeeding?",
    tagalog: "Buntis o nagpapasuso sa sanggol?",
    desc: "Affects dental X-ray clearance and prescription safety.",
    icon: Baby,
    forFemaleOnly: true,
  },
];

export function Step4Medical() {
  const { formData, updateMedicalHistory, nextStep, prevStep } =
    useKioskStore();
  const medical = formData.medicalHistory;
  const isFemale = formData.personalInfo.gender === "female";

  const handleToggle = (key: string, val: boolean) => {
    updateMedicalHistory({
      conditions: {
        ...medical.conditions,
        [key]: val,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="size-3.5 text-blue-400" />
          Step 4: Health &amp; Medical Safety
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Medical Screening
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Your safety is our priority. Please answer truthfully so our dentists can safely administer anesthesia and care.
        </p>
      </div>

      <div className="space-y-3">
        {HEALTH_QUESTIONS.filter((q) => !q.forFemaleOnly || isFemale).map(
          (q) => {
            const isYes = Boolean(medical.conditions[q.key]);
            const Icon = q.icon;

            return (
              <div
                key={q.key}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  isYes
                    ? "bg-[#201505] border-amber-500/60 ring-1 ring-amber-500/40"
                    : "bg-[#070c18]/90 border-[#17233d] hover:border-slate-700"
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      isYes
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      {q.title}
                      {isYes && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                          Noted
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-blue-400 font-medium">{q.tagalog}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{q.desc}</p>
                  </div>
                </div>

                {/* Big Touch YES / NO Switch */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(q.key, false)}
                    className={cn(
                      "h-11 px-5 rounded-xl font-bold text-xs sm:text-sm border transition-all active:scale-95",
                      !isYes
                        ? "bg-slate-800 border-slate-600 text-white shadow-sm"
                        : "bg-[#040813] border-[#1b2946] text-slate-500 hover:text-slate-300"
                    )}
                  >
                    NO
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(q.key, true)}
                    className={cn(
                      "h-11 px-5 rounded-xl font-bold text-xs sm:text-sm border transition-all active:scale-95",
                      isYes
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30"
                        : "bg-[#040813] border-[#1b2946] text-slate-500 hover:text-amber-400 hover:border-amber-500/40"
                    )}
                  >
                    YES
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Allergies Detail Input if Allergies is YES */}
      {medical.conditions.allergies && (
        <div className="rounded-2xl border border-amber-500/50 bg-[#201505] p-5 space-y-2 animate-in fade-in">
          <Label className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <AlertCircle className="size-4" />
            Please specify your drug or food allergies:
          </Label>
          <textarea
            rows={2}
            placeholder="e.g. Allergic to Amoxicillin (rashes) and Mefenamic Acid..."
            value={medical.allergiesNotes}
            onChange={(e) =>
              updateMedicalHistory({ allergiesNotes: e.target.value })
            }
            className="w-full rounded-xl bg-[#040813] border border-amber-500/40 p-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
          />
        </div>
      )}

      {/* Current Medications */}
      <div className="rounded-2xl border border-[#17233d] bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-2">
        <Label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Pill className="size-4 text-blue-400" />
          Are you taking any maintenance medications or daily tablets?
        </Label>
        <textarea
          rows={2}
          placeholder="e.g. Amlodipine 5mg once daily for BP, Metformin 500mg, Multivitamins..."
          value={medical.currentMedications}
          onChange={(e) =>
            updateMedicalHistory({ currentMedications: e.target.value })
          }
          className="w-full rounded-xl bg-[#040813] border border-[#1b2946] p-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
        />
        <p className="text-[11px] text-slate-400">
          Leave blank if you are not currently taking any medications.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="h-12 px-6 text-sm font-semibold border-[#1b2946] bg-[#0b1325] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <Button
          type="submit"
          className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all"
        >
          <span>Continue to Consent &amp; Sign</span>
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
