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
  Stethoscope,
  Cigarette,
  Wine,
  Building2,
  Syringe,
  CheckCircle2,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
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
        {/* Section 1: General Health Screening Yes/No Cards */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-[#1b2946]">
            <Stethoscope className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. General Health Screening
            </h3>
          </div>

          <div className="space-y-2.5">
            {/* Good Health */}
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

            {/* Under Treatment */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between gap-3">
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

            {/* Hospitalization / Operations */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between gap-3">
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

            {/* Allergies Switch */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between gap-3">
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

            {/* Tobacco / Alcohol Habits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between">
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

              <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1b2946] bg-slate-50/70 dark:bg-[#040813] flex items-center justify-between">
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
            </div>

            {/* Women's Health (If Female) */}
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

        {/* Section 2: Specific Medical & Systemic Conditions (Chips) */}
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
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => toggleConditionChip(cond.label)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-center justify-between cursor-pointer",
                    isSelected
                      ? "bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-400/50 shadow-sm"
                      : "bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                  )}
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{cond.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{cond.tagalog}</div>
                  </div>
                  {isSelected ? (
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">YES</span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Detailed Medications & Allergy Notes */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-[#1b2946]">
            <Pill className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Medications &amp; Allergy Specifications
            </h3>
          </div>

          {/* Allergy details */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-rose-500 dark:text-rose-400" />
              Known Allergies (Food, Penicillin, Local Anesthesia, Latex)
            </Label>
            <textarea
              rows={2}
              placeholder="e.g. Allergic to Amoxicillin (rashes) and Mefenamic Acid. Leave blank if none."
              value={medical.allergiesNotes}
              onChange={(e) =>
                updateMedicalHistory({ allergiesNotes: e.target.value })
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-[#040813] border border-slate-200 dark:border-[#1b2946] p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Current medications */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Pill className="size-3.5 text-blue-500 dark:text-blue-400" />
              Current Maintenance Medications &amp; Daily Tablets
            </Label>
            <textarea
              rows={2}
              placeholder="e.g. Amlodipine 5mg once daily, Metformin 500mg, Multivitamins. Leave blank if none."
              value={medical.currentMedications}
              onChange={(e) =>
                updateMedicalHistory({ currentMedications: e.target.value })
              }
              className="w-full rounded-xl bg-slate-50 dark:bg-[#040813] border border-slate-200 dark:border-[#1b2946] p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Past Surgeries / Hospitalizations */}
          {(medical.hasIllnessOperation || medical.isHospitalized) && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="size-3.5 text-amber-500 dark:text-amber-400" />
                Past Surgeries / Hospitalization Details
              </Label>
              <textarea
                rows={2}
                placeholder="e.g. Appendectomy in 2021, Cesarean section in 2023..."
                value={medical.pastSurgeries}
                onChange={(e) =>
                  updateMedicalHistory({ pastSurgeries: e.target.value })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-[#040813] border border-amber-300 dark:border-amber-500/40 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500"
              />
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
          className="h-12 px-6 text-sm font-semibold border-slate-200 dark:border-[#1b2946] bg-slate-100 dark:bg-[#0b1325] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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
