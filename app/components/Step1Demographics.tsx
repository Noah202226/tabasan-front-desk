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
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GENDERS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Separated"];

export function Step1Demographics() {
  const { formData, updatePersonalInfo, nextStep } = useKioskStore();
  const info = formData.personalInfo;

  // Auto-calculate age whenever birthdate changes
  const handleBirthDateChange = (val: string) => {
    let age: number | null = null;
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
      }
    }
    updatePersonalInfo({ birthDate: val, age });
  };

  const isFormValid =
    info.firstName.trim().length > 0 &&
    info.lastName.trim().length > 0 &&
    Boolean(info.gender) &&
    Boolean(info.birthDate) &&
    info.contactNumber.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="size-3.5 text-blue-400" />
          Step 1: Patient Identity & Contact
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Welcome! Let&apos;s start with your details
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Please provide your legal name and contact details as they appear on your government or clinic ID.
        </p>
      </div>

      <div className="rounded-2xl border border-[#17233d] bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6">
        {/* Full Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              First Name <span className="text-blue-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <Input
                required
                placeholder="e.g. Juan"
                value={info.firstName}
                onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Middle Name (Optional)
            </Label>
            <Input
              placeholder="e.g. Santos"
              value={info.middleName}
              onChange={(e) => updatePersonalInfo({ middleName: e.target.value })}
              className="h-12 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Last Name <span className="text-blue-400">*</span>
            </Label>
            <Input
              required
              placeholder="e.g. Dela Cruz"
              value={info.lastName}
              onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              className="h-12 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
            />
          </div>
        </div>

        {/* Gender Selection & Civil Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Biological Gender <span className="text-blue-400">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((g) => {
                const isSelected = info.gender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      updatePersonalInfo({
                        gender: g.id as "male" | "female" | "other",
                      })
                    }
                    className={cn(
                      "h-12 rounded-xl font-medium text-sm transition-all border select-none active:scale-95 flex items-center justify-center",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-bold"
                        : "bg-[#040813] text-slate-300 border-[#1b2946] hover:bg-[#0b1325]"
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
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
                      "h-12 rounded-xl text-xs font-medium transition-all border active:scale-95 flex items-center justify-center",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold"
                        : "bg-[#040813] text-slate-300 border-[#1b2946] hover:bg-[#0b1325]"
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
            <Label className="text-xs font-semibold text-slate-300">
              Date of Birth <span className="text-blue-400">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <Input
                type="date"
                required
                value={info.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Age (Calculated)
            </Label>
            <div className="h-12 flex items-center justify-center rounded-xl bg-[#040813] border border-[#1b2946] text-blue-400 font-bold text-lg">
              {info.age !== null ? `${info.age} yrs old` : "—"}
            </div>
          </div>
        </div>

        {/* Contact Number & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Mobile Contact Number <span className="text-blue-400">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <Input
                type="tel"
                required
                placeholder="09XX XXX XXXX"
                value={info.contactNumber}
                onChange={(e) =>
                  updatePersonalInfo({ contactNumber: e.target.value })
                }
                className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Reception will send SMS alerts when your dental chair is ready.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Email Address (Optional)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={info.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-300">
            Current Home Address (Barangay, City, Province)
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
            <Input
              placeholder="e.g. Brgy. Poblacion, San Fernando City, La Union"
              value={info.address}
              onChange={(e) => updatePersonalInfo({ address: e.target.value })}
              className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
            />
          </div>
        </div>
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
