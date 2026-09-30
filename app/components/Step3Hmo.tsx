"use client";

import React, { useState, useRef } from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  Camera,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wallet,
  Calendar,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImageBase64 } from "@/lib/appwrite";

const HMO_RELATIONSHIPS = [
  { id: "Principal", label: "Principal Cardholder" },
  { id: "Dependent", label: "Dependent / Beneficiary" },
  { id: "Spouse", label: "Spouse" },
  { id: "Child", label: "Child" },
];

export function Step3Hmo() {
  const { formData, updateHmo, hmoProviders, nextStep, prevStep } =
    useKioskStore();
  const hmo = formData.hmo;

  const [activeCameraSide, setActiveCameraSide] = useState<
    "front" | "back" | null
  >(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  // Start live tablet camera for designated card side
  const startCamera = async (side: "front" | "back") => {
    setCameraError(null);
    setActiveCameraSide(side);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setCameraError(
        "Camera access unavailable. You can upload an image file instead."
      );
      setActiveCameraSide(null);
    }
  };

  // Capture snapshot from webcam & compress with HTML canvas (<40KB)
  const capturePhoto = async () => {
    if (videoRef.current && activeCameraSide) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const rawDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        const compressed = await compressImageBase64(rawDataUrl, 320, 0.5);

        if (activeCameraSide === "front") {
          updateHmo({ cardFront: compressed });
        } else {
          updateHmo({ cardBack: compressed });
        }
      }
      stopCamera();
    }
  };

  // Stop webcam stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setActiveCameraSide(null);
  };

  // File upload fallback with compression
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const compressed = await compressImageBase64(
            event.target.result as string,
            320,
            0.5
          );
          if (side === "front") {
            updateHmo({ cardFront: compressed });
          } else {
            updateHmo({ cardBack: compressed });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isPrincipalRequired =
    hmo.hasHmo &&
    hmo.relationship !== "Principal" &&
    hmo.relationship.length > 0;

  const isFormValid =
    !hmo.hasHmo ||
    (hmo.hasHmo &&
      hmo.providerName.trim().length > 0 &&
      hmo.memberNumber.trim().length > 0 &&
      (!isPrincipalRequired || hmo.principalName.trim().length > 0));

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
          Step 3: Payment &amp; Health Insurance
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          How will you be paying for your visit?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Choose whether you are self-paying or using HMO / Health Insurance coverage.
        </p>
      </div>

      {/* Payment Mode Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Self Pay Card */}
        <button
          type="button"
          onClick={() => updateHmo({ hasHmo: false })}
          className={cn(
            "p-6 rounded-2xl border text-left transition-all active:scale-[0.98] flex flex-col justify-between select-none relative overflow-hidden",
            !hmo.hasHmo
              ? "bg-[#0b1325] border-blue-500 ring-2 ring-blue-500/40 shadow-xl shadow-blue-950/50"
              : "bg-[#070c18]/90 border-[#17233d] text-slate-400 hover:border-slate-700 hover:text-slate-200"
          )}
        >
          <div className="space-y-3">
            <div
              className={cn(
                "size-12 rounded-xl flex items-center justify-center transition-colors",
                !hmo.hasHmo
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <Wallet className="size-6" />
            </div>
            <div>
              <h3
                className={cn(
                  "text-lg font-bold transition-colors",
                  !hmo.hasHmo ? "text-white" : "text-slate-300"
                )}
              >
                Self-Pay / Private
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cash, GCash, Maya, Debit, or Credit Card payments handled directly at the reception counter.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold">
            {!hmo.hasHmo ? (
              <span className="text-blue-400 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> Selected Option
              </span>
            ) : (
              <span className="text-slate-500">Tap to select</span>
            )}
          </div>
        </button>

        {/* HMO Card */}
        <button
          type="button"
          onClick={() => updateHmo({ hasHmo: true })}
          className={cn(
            "p-6 rounded-2xl border text-left transition-all active:scale-[0.98] flex flex-col justify-between select-none relative overflow-hidden",
            hmo.hasHmo
              ? "bg-[#0b1325] border-blue-500 ring-2 ring-blue-500/40 shadow-xl shadow-blue-950/50"
              : "bg-[#070c18]/90 border-[#17233d] text-slate-400 hover:border-slate-700 hover:text-slate-200"
          )}
        >
          <div className="space-y-3">
            <div
              className={cn(
                "size-12 rounded-xl flex items-center justify-center transition-colors",
                hmo.hasHmo
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3
                className={cn(
                  "text-lg font-bold transition-colors",
                  hmo.hasHmo ? "text-white" : "text-slate-300"
                )}
              >
                HMO / Health Insurance
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Accredited insurance benefits: Maxicare, Intellicare, Medicard, PhilCare, Etiqa, Avega, etc.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold">
            {hmo.hasHmo ? (
              <span className="text-blue-400 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> Selected Option
              </span>
            ) : (
              <span className="text-slate-500">Tap to select</span>
            )}
          </div>
        </button>
      </div>

      {/* Expanded HMO Details Form if HMO selected */}
      {hmo.hasHmo && (
        <div className="rounded-2xl border border-[#17233d] bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-400" />
              HMO Provider &amp; Coverage Details
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your accredited insurance provider and enter cardholder information.
            </p>
          </div>

          {/* HMO Provider Selection Chips */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Select HMO Provider <span className="text-blue-400">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {hmoProviders.map((provider) => {
                const isSelected =
                  hmo.providerType === "select" &&
                  hmo.providerName === provider.name;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() =>
                      updateHmo({
                        providerType: "select",
                        providerId: provider.id,
                        providerName: provider.name,
                      })
                    }
                    className={cn(
                      "h-11 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 text-center flex items-center justify-center",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30"
                        : "bg-[#040813] text-slate-300 border-[#1b2946] hover:bg-[#0b1325]"
                    )}
                  >
                    {provider.name}
                  </button>
                );
              })}

              {/* Custom / Other HMO Option */}
              <button
                type="button"
                onClick={() =>
                  updateHmo({
                    providerType: "custom",
                    providerId: "custom",
                    providerName:
                      hmo.providerType === "custom" ? hmo.providerName : "",
                  })
                }
                className={cn(
                  "h-11 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 text-center flex items-center justify-center",
                  hmo.providerType === "custom"
                    ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30"
                    : "bg-[#040813] text-slate-300 border-[#1b2946] hover:bg-[#0b1325]"
                )}
              >
                Other HMO
              </button>
            </div>
          </div>

          {/* Custom Provider Name Input if Other HMO */}
          {hmo.providerType === "custom" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label className="text-xs font-semibold text-slate-300">
                Specify HMO / Insurance Company Name <span className="text-blue-400">*</span>
              </Label>
              <Input
                required
                placeholder="e.g. Asalus / Lacson & Lacson"
                value={hmo.providerName}
                onChange={(e) => updateHmo({ providerName: e.target.value })}
                className="h-12 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 text-base"
              />
            </div>
          )}

          {/* Member Card Number */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              HMO Member / Policy / Card Number <span className="text-blue-400">*</span>
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <Input
                required
                placeholder="e.g. 1122-3344-5566-7788"
                value={hmo.memberNumber}
                onChange={(e) => updateHmo({ memberNumber: e.target.value })}
                className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 text-base"
              />
            </div>
          </div>

          {/* Cardholder Relationship */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Cardholder Membership Status <span className="text-blue-400">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HMO_RELATIONSHIPS.map((rel) => {
                const isSelected = hmo.relationship === rel.id;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => updateHmo({ relationship: rel.id })}
                    className={cn(
                      "h-11 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 text-center flex items-center justify-center",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-bold"
                        : "bg-[#040813] text-slate-300 border-[#1b2946] hover:bg-[#0b1325]"
                    )}
                  >
                    {rel.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Principal Cardholder Name (Required if Dependent) */}
          {isPrincipalRequired && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label className="text-xs font-semibold text-slate-300">
                Principal Member Full Name <span className="text-blue-400">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
                <Input
                  required
                  placeholder="e.g. Roberto Dela Cruz (Company Employee)"
                  value={hmo.principalName}
                  onChange={(e) =>
                    updateHmo({ principalName: e.target.value })
                  }
                  className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 text-base"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                The primary employee or subscriber holding the HMO policy.
              </p>
            </div>
          )}

          {/* Card Validity Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-300">
                Valid From (Optional)
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
                <Input
                  type="date"
                  value={hmo.validFrom}
                  onChange={(e) => updateHmo({ validFrom: e.target.value })}
                  className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-300">
                Valid Until / Expiration (Optional)
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
                <Input
                  type="date"
                  value={hmo.validUntil}
                  onChange={(e) => updateHmo({ validUntil: e.target.value })}
                  className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white text-base"
                />
              </div>
            </div>
          </div>

          {/* Dual-Side Card Photo Capture / Upload */}
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>HMO Physical Card Photos</span>
                <span className="text-slate-400 font-normal">
                  Optional but accelerates reception approval
                </span>
              </Label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Front and back captures are automatically compressed to ensure instant sync.
              </p>
            </div>

            {/* Live Camera Viewfinder Overlay if Active */}
            {activeCameraSide && (
              <div className="relative rounded-2xl border-2 border-blue-500 overflow-hidden bg-black max-w-md mx-auto p-2 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-4 border-2 border-dashed border-blue-400/70 rounded-lg pointer-events-none flex items-center justify-center">
                    <p className="text-[11px] text-blue-200 bg-black/60 px-2 py-1 rounded">
                      Align {activeCameraSide === "front" ? "Front" : "Back"} of Card Inside Frame
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={stopCamera}
                    className="h-10 text-xs text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 h-10 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30"
                  >
                    <Camera className="size-4 mr-2" />
                    Capture Photo
                  </Button>
                </div>
              </div>
            )}

            {cameraError && (
              <p className="text-xs text-amber-400 mt-1">{cameraError}</p>
            )}

            {/* Dual Cards: Front and Back */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Front */}
              <div className="rounded-xl border border-[#1b2946] bg-[#040813] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-blue-400" /> Card Front
                  </span>
                  {hmo.cardFront && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="size-3" /> Attached
                    </span>
                  )}
                </div>

                {hmo.cardFront ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-700">
                    <img
                      src={hmo.cardFront}
                      alt="Card Front"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => updateHmo({ cardFront: "" })}
                      className="absolute top-1.5 right-1.5 px-2 py-1 rounded bg-black/80 text-[10px] text-rose-400 hover:text-white border border-rose-500/40"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startCamera("front")}
                      className="flex-1 h-10 text-xs border-[#1b2946] bg-[#080f1e] text-blue-300 hover:bg-[#0f1b34]"
                    >
                      <Camera className="size-3.5 mr-1 text-blue-400" />
                      Take Photo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={frontInputRef}
                      onChange={(e) => handleFileUpload(e, "front")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => frontInputRef.current?.click()}
                      className="flex-1 h-10 text-xs border-[#1b2946] bg-[#080f1e] text-slate-300 hover:bg-[#0f1b34]"
                    >
                      <ImageIcon className="size-3.5 mr-1" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>

              {/* Card Back */}
              <div className="rounded-xl border border-[#1b2946] bg-[#040813] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-blue-400" /> Card Back
                  </span>
                  {hmo.cardBack && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="size-3" /> Attached
                    </span>
                  )}
                </div>

                {hmo.cardBack ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-700">
                    <img
                      src={hmo.cardBack}
                      alt="Card Back"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => updateHmo({ cardBack: "" })}
                      className="absolute top-1.5 right-1.5 px-2 py-1 rounded bg-black/80 text-[10px] text-rose-400 hover:text-white border border-rose-500/40"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startCamera("back")}
                      className="flex-1 h-10 text-xs border-[#1b2946] bg-[#080f1e] text-blue-300 hover:bg-[#0f1b34]"
                    >
                      <Camera className="size-3.5 mr-1 text-blue-400" />
                      Take Photo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={backInputRef}
                      onChange={(e) => handleFileUpload(e, "back")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => backInputRef.current?.click()}
                      className="flex-1 h-10 text-xs border-[#1b2946] bg-[#080f1e] text-slate-300 hover:bg-[#0f1b34]"
                    >
                      <ImageIcon className="size-3.5 mr-1" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
          disabled={!isFormValid}
          className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          <span>Continue to Health Screening</span>
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
