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
  ShieldAlert,
  Baby,
  Stethoscope,
  Cigarette,
  Wine,
  Building2,
  CheckCircle2,
  PlusCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SYSTEMIC_CONDITIONS = [
  { id: "hypertension", label: "Hypertension / High BP", tagalog: "Mataas na presyon" },
  { id: "heart_disease", label: "Heart Disease / Murmur", tagalog: "Sakit sa puso" },
  { id: "diabetes", label: "Diabetes / High Blood Sugar", tagalog: "Diyabetes" },
  { id: "bleeding_disorder", label: "Bleeding Tendency / Easy Bruising", tagalog: "Mabilis magdugo" },
  { id: "blood_thinners", label: "Taking Blood Thinners (Aspirin/Warfarin)", tagalog: "Pampalabnaw ng dugo" },
  { id: "asthma", label: "Asthma / Respiratory Conditions", tagalog: "Hika" },
  { id: "hepatitis", label: "Hepatitis / Liver Disease", tagalog: "Sakit sa atay" },
  { id: "kidney_disease", label: "Kidney Disease", tagalog: "Sakit sa bato" },
  { id: "epilepsy", label: "Epilepsy / Seizures", tagalog: "Kumbulsyon" },
  { id: "thyroid", label: "Thyroid Disorder (Goiter)", tagalog: "Problema sa thyroid" },
  { id: "other", label: "Other Condition / Iba pa", tagalog: "May ibang karamdaman na wala sa listahan" },
];

const SUGGESTED_ALLERGIES = [
  "Penicillin",
  "Amoxicillin",
  "Local Anesthesia (Lidocaine)",
  "Latex Gloves",
  "Aspirin / NSAIDs",
  "Seafood / Food",
];

const SMOKING_LEVEL_OPTIONS = [
  "Occasional / Social",
  "1-5 sticks / day",
  "Half pack / day",
  "1+ pack / day",
  "Vape / Pods daily",
];

const DRINKING_LEVEL_OPTIONS = [
  "Social / Occasional",
  "1-2 times / week",
  "3-5 times / week",
  "Daily / Heavy",
];

const SUGGESTED_OTHER_CONDITIONS = [
  "Anemia",
  "Gout / High Uric Acid",
  "GERD / Acid Reflux",
  "Arthritis",
  "Osteoporosis",
  "PCOS",
  "Glaucoma",
];

const SUGGESTED_MEDICATIONS = [
  "Amlodipine",
  "Losartan",
  "Metformin",
  "Aspirin",
  "Vitamins / Supplements",
];

export function Step4Medical() {
  const { formData, updateMedicalHistory, nextStep, prevStep } =
    useKioskStore();
  const medical = formData.medicalHistory;
  const isFemale = formData.personalInfo.gender === "Female";

  const toggleConditionChip = (label: string) => {
    const current = medical.conditions || [];
    if (current.includes(label)) {
      updateMedicalHistory({
        conditions: current.filter((c) => c !== label),
      });
    } else {
      updateMedicalHistory({
        conditions: [...current, label],
      });
    }
  };

  const appendChipToText = (
    currentText: string,
    chip: string,
    onUpdate: (val: string) => void
  ) => {
    const trimmed = currentText ? currentText.trim() : "";
    if (!trimmed) {
      onUpdate(chip);
    } else {
      const items = trimmed.split(",").map((s) => s.trim().toLowerCase());
      if (!items.includes(chip.toLowerCase())) {
        onUpdate(`${trimmed}, ${chip}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const hasOtherConditionSelected = medical.conditions.includes(
    "Other Condition / Iba pa"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="size-3.5 text-blue-500 dark:text-blue-400" />
          Step 4: Health &amp; Medical Safety
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Medical Screening Questionnaire
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Your safety is our priority. Please answer truthfully so our dentists can safely administer anesthesia and clinical care.
        </p>
      </div>

      <div className="space-y-6">
        {/* ========================================================= */}
        {/* Section 1: General Health Screening Yes/No Cards           */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-[#1b2946]">
            <Stethoscope className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. General Health Screening
            </h3>
          </div>

          <div className="space-y-3">
            {/* 1. Good Health */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Are you in good general health?
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Mabuti ba ang iyong pangkalahatang kalusugan?
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => updateMedicalHistory({ isGoodHealth: false })}
                  className={cn(
                    "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                    !medical.isGoodHealth
                      ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                      : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                  )}
                >
                  NO
                </button>
                <button
                  type="button"
                  onClick={() => updateMedicalHistory({ isGoodHealth: true })}
                  className={cn(
                    "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                    medical.isGoodHealth
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                  )}
                >
                  YES
                </button>
              </div>
            </div>

            {/* 2. Under Doctor's Care / Medical Treatment */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] space-y-3 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Are you currently under a doctor&apos;s care or medical treatment?
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Kasalukuyan bang nagpapagamot sa doktor?
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateMedicalHistory({ isUnderTreatment: false })}
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                      !medical.isUnderTreatment
                        ? "bg-slate-700 text-white border-slate-600 shadow-sm"
                        : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                    )}
                  >
                    NO
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMedicalHistory({ isUnderTreatment: true })}
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                      medical.isUnderTreatment
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm"
                        : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                    )}
                  >
                    YES
                  </button>
                </div>
              </div>

              {/* Dynamic Input: Medical Treatment Details */}
              {medical.isUnderTreatment && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-[#1b2946] space-y-2 animate-in fade-in duration-200">
                  <Label className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="size-3.5 text-amber-500" />
                    Please specify treatment or condition being treated:
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal ml-1">
                      (Pakisaad ang gamutan o doktor)
                    </span>
                  </Label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Under care of Dr. Santos for hypertension, physical therapy, chemotherapy, ongoing dialysis..."
                    value={medical.treatmentDetails || ""}
                    onChange={(e) =>
                      updateMedicalHistory({ treatmentDetails: e.target.value })
                    }
                    className="w-full rounded-xl bg-white dark:bg-[#091122] border border-amber-300 dark:border-amber-500/40 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* 3. Hospitalization / Operations */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] space-y-3 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Have you had past serious operations or hospitalizations?
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Nagkaroon na ba ng malubhang operasyon o naospital?
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      updateMedicalHistory({
                        hasIllnessOperation: false,
                        isHospitalized: false,
                      })
                    }
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                      !medical.hasIllnessOperation && !medical.isHospitalized
                        ? "bg-slate-700 text-white border-slate-600 shadow-sm"
                        : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                    )}
                  >
                    NO
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateMedicalHistory({
                        hasIllnessOperation: true,
                        isHospitalized: true,
                      })
                    }
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                      medical.hasIllnessOperation || medical.isHospitalized
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm"
                        : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                    )}
                  >
                    YES
                  </button>
                </div>
              </div>

              {/* Dynamic Input: Hospitalization & Operation Details */}
              {(medical.hasIllnessOperation || medical.isHospitalized) && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-[#1b2946] space-y-2 animate-in fade-in duration-200">
                  <Label className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-amber-500" />
                    Please specify past operations or reasons for hospitalization:
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal ml-1">
                      (Pakisaad ang naging operasyon o pagkaka-ospital)
                    </span>
                  </Label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Appendectomy in 2021, Cesarean section in 2023, Gallbladder removal, hospitalized for Dengue..."
                    value={medical.pastSurgeries || ""}
                    onChange={(e) =>
                      updateMedicalHistory({
                        pastSurgeries: e.target.value,
                        hospitalizationDetails: e.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-white dark:bg-[#091122] border border-amber-300 dark:border-amber-500/40 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* 4. Allergies Switch & Dynamic Input */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] space-y-3 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Do you have allergies to penicillin, anesthesia, or latex?
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    May allergy sa gamot, pampamanhid, o latex gloves?
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateMedicalHistory({ hasAllergies: false })}
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                      !medical.hasAllergies
                        ? "bg-slate-700 text-white border-slate-600 shadow-sm"
                        : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                    )}
                  >
                    NO
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMedicalHistory({ hasAllergies: true })}
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer",
                      medical.hasAllergies
                        ? "bg-rose-600 text-white border-rose-500 font-bold shadow-sm"
                        : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0f1b34]"
                    )}
                  >
                    YES
                  </button>
                </div>
              </div>

              {/* Dynamic Input: Allergy Specification Form */}
              {medical.hasAllergies && (
                <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 space-y-2.5 animate-in fade-in duration-200 bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400" />
                      Specify What Allergies You Have:
                    </Label>
                    <span className="text-[11px] text-rose-600/80 dark:text-rose-400 font-medium">
                      Pakitukoy ang gamot o bagay na may allergy
                    </span>
                  </div>

                  {/* Quick-tap Suggested Allergy Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_ALLERGIES.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() =>
                          appendChipToText(
                            medical.allergiesNotes,
                            chip,
                            (val) => updateMedicalHistory({ allergiesNotes: val })
                          )
                        }
                        className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-white dark:bg-[#0b1426] border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 transition-all cursor-pointer"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="e.g. Allergic to Amoxicillin (causes skin rash/hives), Lidocaine local anesthesia, Latex gloves, Seafood..."
                    value={medical.allergiesNotes || ""}
                    onChange={(e) =>
                      updateMedicalHistory({ allergiesNotes: e.target.value })
                    }
                    className="w-full rounded-xl bg-white dark:bg-[#040813] border border-rose-300 dark:border-rose-600/50 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-rose-500 focus-visible:ring-1 focus-visible:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* 5. Tobacco & Alcohol Habits with Level Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
              {/* Smoking / Vape */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] space-y-3 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cigarette className="size-3.5 text-slate-500 dark:text-slate-400" />
                      Smoke / Vape User?
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Naninigarilyo / Vape</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ usesTobacco: false })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        !medical.usesTobacco
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ usesTobacco: true })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        medical.usesTobacco
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      YES
                    </button>
                  </div>
                </div>

                {/* Smoking Level & Frequency */}
                {medical.usesTobacco && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#1b2946] space-y-2 animate-in fade-in duration-200">
                    <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      Level of smoking / vaping (Dalas ng paninigarilyo):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {SMOKING_LEVEL_OPTIONS.map((lvl) => {
                        const isSelected = medical.smokingLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updateMedicalHistory({ smokingLevel: lvl })}
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-md font-medium border transition-all cursor-pointer",
                              isSelected
                                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                                : "bg-white dark:bg-[#0a1224] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100"
                            )}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., 3 sticks a day, 5% vape pod..."
                      value={medical.smokingLevel || ""}
                      onChange={(e) =>
                        updateMedicalHistory({ smokingLevel: e.target.value })
                      }
                      className="w-full rounded-lg bg-white dark:bg-[#070e1c] border border-slate-200 dark:border-[#1b2946] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Drinking Alcohol */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] space-y-3 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Wine className="size-3.5 text-slate-500 dark:text-slate-400" />
                      Drinks Alcohol Regularly?
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Madalas uminom ng alak</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ drinksAlcohol: false })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        !medical.drinksAlcohol
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ drinksAlcohol: true })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        medical.drinksAlcohol
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      YES
                    </button>
                  </div>
                </div>

                {/* Alcohol Level & Frequency */}
                {medical.drinksAlcohol && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#1b2946] space-y-2 animate-in fade-in duration-200">
                    <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      Drinking frequency / level (Dalas ng pag-inom):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {DRINKING_LEVEL_OPTIONS.map((lvl) => {
                        const isSelected = medical.drinkingLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updateMedicalHistory({ drinkingLevel: lvl })}
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-md font-medium border transition-all cursor-pointer",
                              isSelected
                                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                                : "bg-white dark:bg-[#0a1224] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100"
                            )}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., 1-2 bottles beer on weekends, occasional wine..."
                      value={medical.drinkingLevel || ""}
                      onChange={(e) =>
                        updateMedicalHistory({ drinkingLevel: e.target.value })
                      }
                      className="w-full rounded-lg bg-white dark:bg-[#070e1c] border border-slate-200 dark:border-[#1b2946] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 6. Women's Health (If Female) */}
            {isFemale && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-in fade-in">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Baby className="size-3.5 text-pink-500 dark:text-pink-400" />
                      Currently Pregnant?
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Buntis sa kasalukuyan</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ isPregnant: false })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        !medical.isPregnant
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ isPregnant: true })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        medical.isPregnant
                          ? "bg-pink-600 text-white border-pink-500 shadow-sm"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      YES
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Baby className="size-3.5 text-pink-500 dark:text-pink-400" />
                      Breastfeeding / Nursing?
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Nagpapasuso sa sanggol</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ isNursing: false })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        !medical.isNursing
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMedicalHistory({ isNursing: true })}
                      className={cn(
                        "h-8 px-3 rounded text-xs font-bold border cursor-pointer",
                        medical.isNursing
                          ? "bg-pink-600 text-white border-pink-500 shadow-sm"
                          : "bg-white dark:bg-[#080f1e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1b2946]"
                      )}
                    >
                      YES
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* Section 2: Specific Medical & Systemic Conditions          */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-[#1b2946]">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-amber-500 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                2. Systemic &amp; Chronic Conditions
              </h3>
            </div>
            {medical.conditions.length > 0 && (
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/30 px-2.5 py-1 rounded-full">
                {medical.conditions.length} indicated
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please tap any conditions you currently have or have been diagnosed with:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SYSTEMIC_CONDITIONS.map((cond) => {
              const isSelected = medical.conditions.includes(cond.label);
              const isOtherButton = cond.id === "other";

              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => toggleConditionChip(cond.label)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-center justify-between cursor-pointer",
                    isSelected
                      ? isOtherButton
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500 text-slate-900 dark:text-white ring-1 ring-blue-400/50 shadow-sm"
                        : "bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-400/50 shadow-sm"
                      : isOtherButton
                      ? "bg-blue-50/40 dark:bg-[#071328]/50 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      : "bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                  )}
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {isOtherButton && <PlusCircle className="size-3.5 text-blue-500" />}
                      {cond.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{cond.tagalog}</div>
                  </div>
                  {isSelected ? (
                    <span className={cn("font-bold text-xs", isOtherButton ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400")}>
                      YES
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 text-xs">
                      {isOtherButton ? "+ ADD" : "—"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dedicated Input Form for "Other Conditions" */}
          {hasOtherConditionSelected && (
            <div className="pt-2 space-y-2.5 animate-in fade-in duration-200 bg-blue-50/40 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <PlusCircle className="size-4 text-blue-600 dark:text-blue-400" />
                  Specify Other Condition(s) Not in the List:
                </Label>
                <span className="text-[11px] text-blue-600/80 dark:text-blue-400 font-medium">
                  Pakitukoy ang iba pang sakit
                </span>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_OTHER_CONDITIONS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      appendChipToText(
                        medical.otherConditions,
                        chip,
                        (val) => updateMedicalHistory({ otherConditions: val })
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-white dark:bg-[#0b1426] border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 transition-all cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                placeholder="e.g., Anemia (low hemoglobin), Gout, Acid Reflux (GERD), Osteoarthritis, PCOS, Glaucoma..."
                value={medical.otherConditions || ""}
                onChange={(e) =>
                  updateMedicalHistory({ otherConditions: e.target.value })
                }
                className="w-full rounded-xl bg-white dark:bg-[#040813] border border-blue-300 dark:border-blue-600/50 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* Section 3: Daily Maintenance Medications                  */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-[#1b2946]">
            <Pill className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Current Daily Medications &amp; Maintenance
            </h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Pill className="size-3.5 text-blue-500 dark:text-blue-400" />
                Current Maintenance Medications, Daily Tablets, or Inhalers
              </Label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                (Iniinom na gamot araw-araw)
              </span>
            </div>

            {/* Quick Suggested Medication Chips */}
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_MEDICATIONS.map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() =>
                    appendChipToText(
                      medical.currentMedications,
                      med,
                      (val) => updateMedicalHistory({ currentMedications: val })
                    )
                  }
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-[#0d162a] border border-slate-200 dark:border-[#1b2946] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#152342] active:scale-95 transition-all cursor-pointer"
                >
                  + {med}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder="e.g., Amlodipine 5mg once daily, Metformin 500mg, Multivitamins, Salbutamol inhaler as needed. Leave blank if none."
              value={medical.currentMedications}
              onChange={(e) =>
                updateMedicalHistory({ currentMedications: e.target.value })
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-[#040813] border border-slate-200 dark:border-[#1b2946] p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Clean Summary Chips for quick review of alerts entered above */}
          {(medical.hasAllergies || medical.hasIllnessOperation || medical.isUnderTreatment) && (
            <div className="pt-2 border-t border-slate-200 dark:border-[#1b2946] space-y-1.5 text-xs">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="size-3.5 text-blue-500" />
                Active Health Alerts Recorded:
              </div>
              <div className="flex flex-wrap gap-2">
                {medical.hasAllergies && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-medium">
                    <ShieldAlert className="size-3 text-rose-500" />
                    Allergies: {medical.allergiesNotes ? medical.allergiesNotes : "Yes (specified above)"}
                  </span>
                )}
                {medical.isUnderTreatment && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-medium">
                    <Stethoscope className="size-3 text-amber-500" />
                    Medical Treatment: {medical.treatmentDetails ? medical.treatmentDetails : "Yes (under care)"}
                  </span>
                )}
                {(medical.hasIllnessOperation || medical.isHospitalized) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-medium">
                    <Building2 className="size-3 text-amber-500" />
                    Operations / Hospital: {medical.pastSurgeries ? medical.pastSurgeries : "Yes (past surgeries)"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="h-12 px-6 text-sm font-semibold border-slate-200 dark:border-[#1b2946] bg-slate-100 dark:bg-[#0b1325] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <Button
          type="submit"
          className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <span>Continue to Consent &amp; Sign</span>
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
