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
} from "lucide-react";
import { cn } from "@/lib/utils";

const HMO_PROVIDERS = [
  "Maxicare",
  "Intellicare",
  "Medicard",
  "PhilCare",
  "Etiqa",
  "Cigna",
  "Avega",
  "Generali",
  "ValuCare",
  "Insular Health Care",
  "Other HMO",
];

export function Step3Hmo() {
  const { formData, updateHmo, nextStep, prevStep } = useKioskStore();
  const hmo = formData.hmo;

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start live tablet camera
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
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
        "Camera access not allowed or unavailable. You can upload an image file instead."
      );
      setIsCameraActive(false);
    }
  };

  // Capture snapshot from webcam
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        updateHmo({ cardImage: dataUrl });
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
    setIsCameraActive(false);
  };

  // File upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateHmo({ cardImage: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid =
    !hmo.hasHmo ||
    (hmo.hasHmo &&
      hmo.provider.trim().length > 0 &&
      hmo.cardNumber.trim().length > 0);

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
                Maxicare, Intellicare, Medicard, PhilCare, Etiqa, or company accredited insurance benefits.
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
              HMO Provider &amp; Card Information
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Please choose your provider and enter your member card number.
            </p>
          </div>

          {/* Popular HMO Provider Chips */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              Select HMO Provider <span className="text-blue-400">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HMO_PROVIDERS.map((provider) => {
                const isSelected = hmo.provider === provider;
                return (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => updateHmo({ provider })}
                    className={cn(
                      "h-11 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 text-center flex items-center justify-center",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30"
                        : "bg-[#040813] text-slate-300 border-[#1b2946] hover:bg-[#0b1325]"
                    )}
                  >
                    {provider}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Member Card Number */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              HMO Member / Account ID Number <span className="text-blue-400">*</span>
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              <Input
                required
                placeholder="e.g. 1122-3344-5566-7788"
                value={hmo.cardNumber}
                onChange={(e) => updateHmo({ cardNumber: e.target.value })}
                className="h-12 pl-10 bg-[#040813] border-[#1b2946] text-white placeholder:text-slate-500 focus-visible:border-blue-500 text-base"
              />
            </div>
          </div>

          {/* HMO Card Photo Capture / Upload */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>HMO Card Photo (Front of Card)</span>
              <span className="text-slate-400 font-normal">Optional but speeds up verification</span>
            </Label>

            {hmo.cardImage ? (
              /* Preview of captured card */
              <div className="relative rounded-2xl border border-slate-700/80 overflow-hidden bg-[#040813] p-2 max-w-sm mx-auto">
                <img
                  src={hmo.cardImage}
                  alt="HMO Card Preview"
                  className="w-full h-44 object-cover rounded-xl"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateHmo({ cardImage: "" })}
                    className="flex-1 h-9 text-xs border-slate-700 text-rose-400 hover:bg-rose-950/30"
                  >
                    <RotateCcw className="size-3.5 mr-1" />
                    Retake / Remove Photo
                  </Button>
                </div>
              </div>
            ) : isCameraActive ? (
              /* Live Camera Viewfinder */
              <div className="relative rounded-2xl border-2 border-blue-500 overflow-hidden bg-black max-w-md mx-auto p-2 space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-4 border-2 border-dashed border-blue-400/70 rounded-lg pointer-events-none flex items-center justify-center">
                    <p className="text-[11px] text-blue-200 bg-black/60 px-2 py-1 rounded">
                      Align Card Inside Frame
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
                    Take Photo
                  </Button>
                </div>
              </div>
            ) : (
              /* Trigger Buttons */
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={startCamera}
                  className="flex-1 h-12 border-[#1b2946] bg-[#040813] text-blue-300 hover:bg-[#0b1325] hover:border-blue-500/50"
                >
                  <Camera className="size-4 mr-2 text-blue-400" />
                  Take Photo with Camera
                </Button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12 border-[#1b2946] bg-[#040813] text-slate-300 hover:bg-[#0b1325]"
                >
                  Upload Saved Photo
                </Button>
              </div>
            )}

            {cameraError && (
              <p className="text-xs text-amber-400 mt-1">{cameraError}</p>
            )}
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
