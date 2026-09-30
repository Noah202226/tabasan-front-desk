"use client";

import React, { useRef, useState, useEffect } from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PenLine,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImageBase64 } from "@/lib/appwrite";

export function Step5Consent() {
  const {
    formData,
    updateConsent,
    submitForm,
    prevStep,
    isSubmitting,
  } = useKioskStore();

  const consent = formData.consent;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasSignature, setHasSignature] = useState(Boolean(consent.signature));
  const isDrawing = useRef(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#60a5fa"; // blue-400
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Restore existing signature if present
    if (consent.signature) {
      const img = new Image();
      img.src = consent.signature;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasSignature(true);
      };
    }
  }, [consent.signature]);

  const getPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawing.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = async () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      // Compress signature image to stay below Appwrite 65KB limit (< 15KB)
      const rawDataUrl = canvas.toDataURL("image/jpeg", 0.6);
      const compressed = await compressImageBase64(rawDataUrl, 320, 0.5);
      updateConsent({ signature: compressed, signedAt: Date.now() });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    updateConsent({ signature: "", signedAt: 0 });
  };

  const isFormValid =
    consent.agreedToTerms &&
    consent.dataPrivacyConsent &&
    hasSignature &&
    !isSubmitting;

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      await submitForm();
    }
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="size-3.5 text-blue-400" />
          Step 5: Consent &amp; Signature
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Data Privacy &amp; Treatment Consent
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Review the consent terms and sign using your finger or stylus below.
        </p>
      </div>

      <div className="rounded-2xl border border-[#17233d] bg-[#070c18]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6">
        {/* Scrollable Legal Consent Box */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Lock className="size-3.5 text-blue-400" />
            Republic Act No. 10173 &amp; Clinic Treatment Agreement
          </Label>
          <div className="rounded-xl border border-[#1b2946] bg-[#040813] p-4 text-xs text-slate-400 leading-relaxed max-h-44 overflow-y-auto space-y-2.5">
            <p>
              <strong className="text-slate-200">1. Data Privacy Compliance (RA 10173):</strong> In
              accordance with the Philippine Data Privacy Act of 2012, Tabasan Dental Clinic collects
              and processes your personal and health records solely for diagnostic examination,
              treatment planning, insurance verification, and continuity of dental healthcare. Your
              records are kept strictly confidential and protected by clinic encryption protocols.
            </p>
            <p>
              <strong className="text-slate-200">2. Truthful Health Disclosure:</strong> You certify
              that the personal demographics, medical history, systemic conditions, and current medications provided in this
              self-service intake are true and accurate. Withholding health information may compromise
              anesthetic safety and clinical outcomes.
            </p>
            <p>
              <strong className="text-slate-200">3. Examination &amp; X-Ray Consent:</strong> You authorize our
              licensed dentists and clinical hygienists to conduct an oral examination, necessary dental
              radiographs (digital X-rays), and discuss treatment options with you prior to performing any
              procedure.
            </p>
          </div>
        </div>

        {/* Checkbox A: Truthfulness */}
        <div
          onClick={() =>
            updateConsent({ agreedToTerms: !consent.agreedToTerms })
          }
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99]",
            consent.agreedToTerms
              ? "bg-blue-950/40 border-blue-500/80 text-white ring-1 ring-blue-500/40"
              : "bg-[#040813] border-[#1b2946] text-slate-300 hover:border-slate-700"
          )}
        >
          <div
            className={cn(
              "size-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors",
              consent.agreedToTerms
                ? "bg-blue-600 border-blue-400 text-white shadow-sm"
                : "border-[#1b2946] bg-[#0b1325]"
            )}
          >
            {consent.agreedToTerms && <Check className="size-4 stroke-[3]" />}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold text-white">
              I confirm that all personal and health information provided is truthful and accurate
            </span>{" "}
            to the best of my knowledge.
          </div>
        </div>

        {/* Checkbox B: Data Privacy Consent */}
        <div
          onClick={() =>
            updateConsent({
              dataPrivacyConsent: !consent.dataPrivacyConsent,
            })
          }
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99]",
            consent.dataPrivacyConsent
              ? "bg-blue-950/40 border-blue-500/80 text-white ring-1 ring-blue-500/40"
              : "bg-[#040813] border-[#1b2946] text-slate-300 hover:border-slate-700"
          )}
        >
          <div
            className={cn(
              "size-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors",
              consent.dataPrivacyConsent
                ? "bg-blue-600 border-blue-400 text-white shadow-sm"
                : "border-[#1b2946] bg-[#0b1325]"
            )}
          >
            {consent.dataPrivacyConsent && <Check className="size-4 stroke-[3]" />}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold text-white">
              I give my explicit consent to Tabasan Dental Clinic
            </span>{" "}
            to collect and process my health data in accordance with Republic Act No. 10173 for dental treatment and clinic record keeping.
          </div>
        </div>

        {/* Touch Signature Pad */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PenLine className="size-4 text-blue-400" />
              Patient or Legal Guardian Signature <span className="text-blue-400">*</span>
            </Label>
            {hasSignature && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Signature Recorded
              </span>
            )}
          </div>

          <div className="relative rounded-2xl border-2 border-dashed border-[#1b2946] bg-[#040813] overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 cursor-crosshair block"
            />

            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 font-medium text-sm select-none">
                Draw Your Signature Here (Finger or Stylus)
              </div>
            )}

            {hasSignature && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="absolute top-2 right-2 h-8 text-xs bg-[#0b1325] border border-[#1b2946] text-slate-400 hover:text-white"
              >
                <RotateCcw className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            By signing above, you confirm you are the patient or legal guardian of the patient.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
          className="h-12 px-6 text-sm font-semibold border-[#1b2946] bg-[#0b1325] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={!isFormValid}
          className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xl shadow-blue-600/30 transition-all disabled:opacity-40 active:scale-95 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin text-white" />
              <span>Transmitting to Reception...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="size-4 text-white" />
              <span>Complete &amp; Submit Check-In</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
