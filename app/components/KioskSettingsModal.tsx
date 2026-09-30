"use client";

import React, { useState } from "react";
import { useKioskStore } from "@/app/store/kiosk-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Unlock,
  Building2,
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { kioskDb } from "@/lib/db";

interface KioskSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ADMIN_PIN = process.env.NEXT_PUBLIC_KIOSK_ADMIN_PIN || "2026";

export function KioskSettingsModal({
  open,
  onOpenChange,
}: KioskSettingsModalProps) {
  const {
    branchId,
    branchName,
    branches,
    setBranch,
    offlineQueueCount,
    drainOfflineQueue,
    isOnline,
    fetchBranches,
    setOfflineQueueCount,
  } = useKioskStore();

  const [enteredPin, setEnteredPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredPin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      setEnteredPin("");
      toast.success("Staff privileges unlocked.");
    } else {
      setPinError(true);
      setEnteredPin("");
      toast.error("Incorrect Staff PIN.");
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === "CLEAR") {
      setEnteredPin("");
      setPinError(false);
    } else if (val === "ENTER") {
      handlePinSubmit();
    } else {
      if (enteredPin.length < 6) {
        const next = enteredPin + val;
        setEnteredPin(next);
        setPinError(false);
        if (next === ADMIN_PIN) {
          setIsAuthenticated(true);
          setEnteredPin("");
          toast.success("Staff privileges unlocked.");
        }
      }
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setEnteredPin("");
    setPinError(false);
    onOpenChange(false);
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await drainOfflineQueue();
      await fetchBranches();
      const count = await kioskDb.offlineSubmissions.count();
      setOfflineQueueCount(count);
      toast.success("Sync completed.");
    } catch {
      toast.error("Failed to sync offline queue.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearOfflineDB = async () => {
    if (
      confirm(
        "Are you sure you want to purge local Dexie cached intake records? Any unsynced data will be deleted."
      )
    ) {
      await kioskDb.offlineSubmissions.clear();
      setOfflineQueueCount(0);
      toast.info("Offline database cleared.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-[#0b1325] border-[#17233d] text-slate-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-blue-400">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              {isAuthenticated ? (
                <Unlock className="size-5 text-blue-400" />
              ) : (
                <Lock className="size-5 text-blue-400" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">
                {isAuthenticated ? "Kiosk Station Settings" : "Clinic Staff Verification"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                {isAuthenticated
                  ? "Configure active branch location and manage offline sync queue."
                  : "Enter the 4-digit receptionist security PIN to configure this tablet."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!isAuthenticated ? (
          /* PIN Verification View */
          <div className="space-y-5 pt-3">
            <div className="flex flex-col items-center justify-center">
              {/* PIN Dots Indicator */}
              <div className="flex gap-3 mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`size-4 rounded-full border-2 transition-all ${
                      enteredPin.length > i
                        ? "bg-blue-500 border-blue-400 shadow-md shadow-blue-500/50 scale-110"
                        : "border-slate-700 bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              {pinError && (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 animate-bounce mb-2">
                  <AlertCircle className="size-3.5" />
                  Incorrect PIN. Please try again.
                </p>
              )}
            </div>

            {/* Touch Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 text-lg font-bold rounded-xl border-[#1b2946] bg-[#040813] hover:bg-slate-800 text-white active:scale-95 transition-transform"
                >
                  {num}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleKeypadPress("CLEAR")}
                className="h-12 text-xs font-semibold rounded-xl text-rose-400 hover:bg-rose-950/30"
              >
                CLEAR
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleKeypadPress("0")}
                className="h-12 text-lg font-bold rounded-xl border-[#1b2946] bg-[#040813] hover:bg-slate-800 text-white active:scale-95 transition-transform"
              >
                0
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => handleKeypadPress("ENTER")}
                className="h-12 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
              >
                SUBMIT
              </Button>
            </div>
          </div>
        ) : (
          /* Staff Settings View */
          <div className="space-y-5 pt-2">
            {/* Branch Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="size-4 text-blue-400" />
                Active Tablet Clinic Branch
              </Label>
              <div className="grid gap-2">
                {branches.map((b) => {
                  const isSelected = b.id === branchId;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBranch(b.id, b.name);
                        toast.success(`Station branch locked to: ${b.name}`);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-950/40 text-blue-200 ring-1 ring-blue-500/50"
                          : "border-[#1b2946] bg-[#040813] text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2
                          className={`size-4 ${
                            isSelected ? "text-blue-400" : "text-slate-500"
                          }`}
                        />
                        <span className="font-medium">{b.name}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-slate-700 text-slate-400"
                        >
                          Select
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-[#17233d]" />

            {/* Offline Database & Sync Status */}
            <div className="space-y-3 rounded-xl bg-[#040813] border border-[#17233d] p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Offline Queue (Dexie DB)
                  </span>
                </div>
                <Badge
                  variant={offlineQueueCount > 0 ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {offlineQueueCount} Pending
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleForceSync}
                  disabled={isSyncing || !isOnline}
                  className="flex-1 h-9 text-xs border-[#1b2946] bg-[#0b1325] text-slate-200 hover:bg-slate-800"
                >
                  <RefreshCw
                    className={`size-3.5 mr-1.5 ${
                      isSyncing ? "animate-spin text-blue-400" : "text-slate-400"
                    }`}
                  />
                  Force Sync Now
                </Button>
                {offlineQueueCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearOfflineDB}
                    className="h-9 text-xs text-rose-400 hover:bg-rose-950/30"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-10 border-[#1b2946] bg-[#040813] text-slate-300"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="flex-1 h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30"
                onClick={() => {
                  setIsAuthenticated(false);
                  onOpenChange(false);
                  toast.info("Kiosk locked for patient intake.");
                }}
              >
                Lock Station
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
