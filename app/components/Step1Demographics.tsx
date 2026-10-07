"use client";

import React from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  ArrowRight,
  Sparkles,
  Baby,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GENDERS = [
  { id: "Male", label: "Male" },
  { id: "Female", label: "Female" },
];

const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Separated"];

const PATIENT_TYPES = [
  {
    id: "adult",
    label: "Adult (18+)",
    sub: "Self-registering adult patient",
    icon: User,
  },
  {
    id: "minor",
    label: "Minor / Child (< 18)",
    sub: "Requires Parent/Guardian details",
    icon: Baby,
  },
  {
    id: "mentally_disabled",
    label: "Special Care / PWD",
    sub: "Assisted by legal guardian",
    icon: HeartHandshake,
  },
];

const GUARDIAN_RELATIONS = [
  "Mother",
  "Father",
  "Legal Guardian",
  "Grandparent",
  "Sibling (Adult)",
  "Relative",
];

export function Step1Demographics() {
  const { formData, updatePersonalInfo, nextStep } = useKioskStore();
  const info = formData.personalInfo;

  // Auto-calculate age whenever birthdate changes and auto-flag minor if < 18
  const handleBirthDateChange = (val: string) => {
    let age: number | null = null;
    let nextPatientType = info.patientType;

    if (val) {
      const birth = new Date(val);
      const today = new Date();
      if (!isNaN(birth.getTime())) {
        let calculated = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calculated--;
        }
        age = Math.max(0, calculated);

        // Auto toggle to minor if age is under 18
        if (age < 18) {
          nextPatientType = "minor";
        } else if (info.patientType === "minor") {
          nextPatientType = "adult";
        }
      }
    }
    updatePersonalInfo({ birthDate: val, age, patientType: nextPatientType });
  };

  const isGuardianRequired =
    info.patientType === "minor" || info.patientType === "mentally_disabled";

  const isFormValid =
    info.firstName.trim().length > 0 &&
    info.lastName.trim().length > 0 &&
    Boolean(info.gender) &&
    Boolean(info.birthDate) &&
    info.contactNumber.trim().length >= 10 &&
    (!isGuardianRequired ||
      (info.guardianName.trim().length > 0 &&
        info.guardianContact.trim().length >= 10));

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
          Step 1: Patient Identity &amp; Contact
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome! Let&apos;s start with your details
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Please provide your legal name and contact details as they appear on your government or clinic ID.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-[#17233d] bg-white dark:bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6">
        {/* Patient Classification Selector */}
        <div className="space-y-2.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Shield className="size-3.5 text-blue-500 dark:text-blue-400" />
            Patient Classification <span className="text-blue-500 dark:text-blue-400">*</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PATIENT_TYPES.map((pt) => {
              const Icon = pt.icon;
              const isSelected = info.patientType === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() =>
                    updatePersonalInfo({
                      patientType: pt.id as "adult" | "minor" | "mentally_disabled",
                    })
                  }
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-3 cursor-pointer",
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-blue-500/50"
                      : "bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0 mt-0.5",
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200/80 dark:bg-[#0f172a] text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {pt.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {pt.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              First Name <span className="text-blue-500 dark:text-blue-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
              <Input
                required
                placeholder="e.g. Juan"
                value={info.firstName}
                onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Middle Name (Optional)
            </Label>
            <Input
              placeholder="e.g. Santos"
              value={info.middleName}
              onChange={(e) => updatePersonalInfo({ middleName: e.target.value })}
              className="h-12 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Last Name <span className="text-blue-500 dark:text-blue-400">*</span>
            </Label>
            <Input
              required
              placeholder="e.g. Dela Cruz"
              value={info.lastName}
              onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              className="h-12 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
            />
          </div>
        </div>

        {/* Gender Selection & Civil Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Biological Gender <span className="text-blue-500 dark:text-blue-400">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => {
                const isSelected = info.gender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      updatePersonalInfo({
                        gender: g.id as "Male" | "Female",
                      })
                    }
                    className={cn(
                      "h-12 rounded-xl font-medium text-sm transition-all border select-none active:scale-95 flex items-center justify-center cursor-pointer",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 font-bold"
                        : "bg-slate-50 dark:bg-[#040813] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Civil Status
            </Label>
            <div className="grid grid-cols-4 gap-1.5">
              {CIVIL_STATUSES.map((cs) => {
                const isSelected = info.civilStatus === cs;
                return (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => updatePersonalInfo({ civilStatus: cs })}
                    className={cn(
                      "h-12 rounded-xl text-xs font-medium transition-all border active:scale-95 flex items-center justify-center cursor-pointer",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md font-bold"
                        : "bg-slate-50 dark:bg-[#040813] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1b2946] hover:bg-slate-100 dark:hover:bg-[#0b1325]"
                    )}
                  >
                    {cs}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date of Birth & Auto Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2 space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date of Birth <span className="text-blue-500 dark:text-blue-400">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="date"
                required
                value={info.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Age (Calculated)
            </Label>
            <div className="h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-[#040813] border border-slate-200 dark:border-[#1b2946] text-blue-600 dark:text-blue-400 font-bold text-lg">
              {info.age !== null ? `${info.age} yrs old` : "—"}
            </div>
          </div>
        </div>

        {/* Contact Number & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Primary Mobile Number <span className="text-blue-500 dark:text-blue-400">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="tel"
                required
                placeholder="09XX XXX XXXX"
                value={info.contactNumber}
                onChange={(e) =>
                  updatePersonalInfo({ contactNumber: e.target.value })
                }
                className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Reception will send SMS alerts when your dental chair is ready.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address (Optional)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={info.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>
        </div>

        {/* Occupation & Home Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Occupation / School (Optional)
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="e.g. Teacher, Student, Engineer"
                value={info.occupation}
                onChange={(e) =>
                  updatePersonalInfo({ occupation: e.target.value })
                }
                className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Current Home Address (Barangay, City, Province)
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="e.g. Brgy. Poblacion, San Fernando City, La Union"
                value={info.address}
                onChange={(e) => updatePersonalInfo({ address: e.target.value })}
                className="h-12 pl-10 bg-slate-50 dark:bg-[#040813] border-slate-200 dark:border-[#1b2946] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>
        </div>

        {/* Parent / Legal Guardian Section (Conditionally active if minor or special care) */}
        {isGuardianRequired && (
          <div className="rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/5 p-4 sm:p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Shield className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Parent / Legal Guardian Authorization
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  Required for patients under 18 years old or requiring special care.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                  Guardian Full Name <span className="text-amber-600 dark:text-amber-400">*</span>
                </Label>
                <Input
                  required
                  placeholder="e.g. Maria Santos Dela Cruz"
                  value={info.guardianName}
                  onChange={(e) =>
                    updatePersonalInfo({ guardianName: e.target.value })
                  }
                  className="h-11 bg-white dark:bg-[#040813] border-amber-300 dark:border-amber-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                  Relationship to Patient
                </Label>
                <select
                  value={info.guardianRelation || "Parent"}
                  onChange={(e) =>
                    updatePersonalInfo({ guardianRelation: e.target.value })
                  }
                  className="h-11 w-full rounded-md px-3 bg-white dark:bg-[#040813] border border-amber-300 dark:border-amber-500/30 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  {GUARDIAN_RELATIONS.map((rel) => (
                    <option key={rel} value={rel} className="bg-white dark:bg-[#0b1325] text-slate-900 dark:text-white">
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                  Guardian Mobile Number <span className="text-amber-600 dark:text-amber-400">*</span>
                </Label>
                <Input
                  type="tel"
                  required
                  placeholder="09XX XXX XXXX"
                  value={info.guardianContact}
                  onChange={(e) =>
                    updatePersonalInfo({ guardianContact: e.target.value })
                  }
                  className="h-11 bg-white dark:bg-[#040813] border-amber-300 dark:border-amber-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Navigation */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={!isFormValid}
          className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          <span>Continue to Chief Concern</span>
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
