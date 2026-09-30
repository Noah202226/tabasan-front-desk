import { create } from "zustand";
import { ID, Query } from "appwrite";
import {
  databases,
  DATABASE_ID,
  INTAKE_COLLECTION_ID,
  BRANCHES_COLLECTION_ID,
  UNIVERSAL_PERMISSIONS,
} from "@/lib/appwrite";
import { kioskDb, type KioskQueuedSubmission } from "@/lib/db";
import { toast } from "sonner";

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: "male" | "female" | "other" | "";
  birthDate: string;
  age: number | null;
  contactNumber: string;
  email: string;
  address: string;
  occupation: string;
  civilStatus: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  contactNumber: string;
}

export interface HmoInfo {
  hasHmo: boolean;
  provider: string;
  cardNumber: string;
  cardImage: string;
}

export interface VisitReason {
  chiefComplaint: string;
  selectedChips: string[];
  painLevel: number;
  notes: string;
}

export interface MedicalHistory {
  conditions: Record<string, boolean>;
  allergiesNotes: string;
  currentMedications: string;
}

export interface ConsentInfo {
  agreedToTerms: boolean;
  dataPrivacyConsent: boolean;
  signature: string;
  signedAt: number;
}

export interface KioskFormData {
  personalInfo: PersonalInfo;
  emergencyContact: EmergencyContact;
  hmo: HmoInfo;
  visitReason: VisitReason;
  medicalHistory: MedicalHistory;
  consent: ConsentInfo;
}

export interface BranchItem {
  id: string;
  name: string;
  isMain?: boolean;
}

export const INITIAL_FORM_DATA: KioskFormData = {
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    age: null,
    contactNumber: "",
    email: "",
    address: "",
    occupation: "",
    civilStatus: "Single",
  },
  emergencyContact: {
    name: "",
    relationship: "Parent",
    contactNumber: "",
  },
  hmo: {
    hasHmo: false,
    provider: "",
    cardNumber: "",
    cardImage: "",
  },
  visitReason: {
    chiefComplaint: "",
    selectedChips: [],
    painLevel: 0,
    notes: "",
  },
  medicalHistory: {
    conditions: {
      hypertension: false,
      heartDisease: false,
      diabetes: false,
      bleedingDisorder: false,
      allergies: false,
      asthma: false,
      hepatitis: false,
      pregnantOrNursing: false,
      bloodThinners: false,
    },
    allergiesNotes: "",
    currentMedications: "",
  },
  consent: {
    agreedToTerms: false,
    dataPrivacyConsent: false,
    signature: "",
    signedAt: 0,
  },
};

interface KioskStoreState {
  currentStep: number;
  branchId: string;
  branchName: string;
  branches: BranchItem[];
  isOnline: boolean;
  isSubmitting: boolean;
  offlineQueueCount: number;
  formData: KioskFormData;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBranch: (branchId: string, branchName: string) => void;
  setIsOnline: (isOnline: boolean) => void;
  setOfflineQueueCount: (count: number) => void;

  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateEmergencyContact: (data: Partial<EmergencyContact>) => void;
  updateHmo: (data: Partial<HmoInfo>) => void;
  updateVisitReason: (data: Partial<VisitReason>) => void;
  updateMedicalHistory: (data: Partial<MedicalHistory>) => void;
  updateConsent: (data: Partial<ConsentInfo>) => void;

  resetForm: () => void;
  submitForm: () => Promise<boolean>;
  drainOfflineQueue: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  initKiosk: () => Promise<void>;
}

const DEFAULT_BRANCH_ID =
  process.env.NEXT_PUBLIC_KIOSK_DEFAULT_BRANCH_ID || "main";

export const useKioskStore = create<KioskStoreState>((set, get) => ({
  currentStep: 1,
  branchId: DEFAULT_BRANCH_ID,
  branchName: "Main Clinic Branch",
  branches: [
    { id: "main", name: "Tabasan Dental Clinic - Main Branch", isMain: true },
    { id: "annex", name: "Tabasan Dental Clinic - Annex Branch" },
  ],
  isOnline: true,
  isSubmitting: false,
  offlineQueueCount: 0,
  formData: JSON.parse(JSON.stringify(INITIAL_FORM_DATA)),

  setStep: (step) => set({ currentStep: Math.max(1, Math.min(6, step)) }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 6) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setBranch: (branchId, branchName) => {
    try {
      localStorage.setItem("tabasan_kiosk_branch_id", branchId);
      localStorage.setItem("tabasan_kiosk_branch_name", branchName);
    } catch {
      // LocalStorage might be disabled
    }
    set({ branchId, branchName });
  },

  setIsOnline: (isOnline) => set({ isOnline }),

  setOfflineQueueCount: (count) => set({ offlineQueueCount: count }),

  updatePersonalInfo: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        personalInfo: { ...state.formData.personalInfo, ...data },
      },
    })),

  updateEmergencyContact: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        emergencyContact: { ...state.formData.emergencyContact, ...data },
      },
    })),

  updateHmo: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        hmo: { ...state.formData.hmo, ...data },
      },
    })),

  updateVisitReason: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        visitReason: { ...state.formData.visitReason, ...data },
      },
    })),

  updateMedicalHistory: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        medicalHistory: { ...state.formData.medicalHistory, ...data },
      },
    })),

  updateConsent: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        consent: { ...state.formData.consent, ...data },
      },
    })),

  resetForm: () =>
    set({
      currentStep: 1,
      formData: JSON.parse(JSON.stringify(INITIAL_FORM_DATA)),
      isSubmitting: false,
    }),

  fetchBranches: async () => {
    try {
      if (typeof window === "undefined") return;

      // Try Appwrite Cloud
      const response = await databases.listDocuments(
        DATABASE_ID,
        BRANCHES_COLLECTION_ID,
        [Query.limit(50)]
      );

      if (response && response.documents && response.documents.length > 0) {
        const loadedBranches: BranchItem[] = response.documents.map(
          (doc: any) => ({
            id: doc.$id || doc.id,
            name: doc.name || doc.branchName || "Branch",
            isMain: Boolean(doc.isMain),
          })
        );

        set({ branches: loadedBranches });

        // Update Dexie branch cache
        await kioskDb.branches.clear();
        for (const b of loadedBranches) {
          await kioskDb.branches.put(b);
        }

        // Restore active branch name
        const currentBranchId = get().branchId;
        const matchingBranch = loadedBranches.find(
          (b) => b.id === currentBranchId
        );
        if (matchingBranch) {
          set({ branchName: matchingBranch.name });
        }
        return;
      }
    } catch {
      // Fallback to Dexie cache if network/Appwrite fails
      try {
        const cachedBranches = await kioskDb.branches.toArray();
        if (cachedBranches && cachedBranches.length > 0) {
          set({ branches: cachedBranches });
          const matchingBranch = cachedBranches.find(
            (b) => b.id === get().branchId
          );
          if (matchingBranch) {
            set({ branchName: matchingBranch.name });
          }
        }
      } catch {
        // Leave defaults
      }
    }
  },

  submitForm: async () => {
    const { formData, branchId, isOnline } = get();
    set({ isSubmitting: true });

    const submissionId = ID.unique();
    const now = Date.now();

    const submissionPayload = {
      branchId,
      status: "pending_review" as const,
      submittedAt: now,
      personalInfo: JSON.stringify(formData.personalInfo),
      emergencyContact: JSON.stringify(formData.emergencyContact),
      hmo: JSON.stringify(formData.hmo),
      visitReason: JSON.stringify(formData.visitReason),
      medicalHistory: JSON.stringify(formData.medicalHistory),
      consent: JSON.stringify(formData.consent),
    };

    let pushSuccess = false;

    // Try online direct push first if navigator reports online
    if (isOnline) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          INTAKE_COLLECTION_ID,
          submissionId,
          submissionPayload,
          UNIVERSAL_PERMISSIONS
        );
        pushSuccess = true;
      } catch (err: any) {
        console.warn("Direct push to Appwrite Cloud failed, queuing locally in Dexie:", err);
      }
    }

    if (!pushSuccess) {
      // Offline fallback: save to Dexie DB
      try {
        const offlineRecord: KioskQueuedSubmission = {
          id: submissionId,
          branchId: submissionPayload.branchId,
          status: "pending_review",
          submittedAt: submissionPayload.submittedAt,
          personalInfo: submissionPayload.personalInfo,
          emergencyContact: submissionPayload.emergencyContact,
          hmo: submissionPayload.hmo,
          visitReason: submissionPayload.visitReason,
          medicalHistory: submissionPayload.medicalHistory,
          consent: submissionPayload.consent,
          createdAt: now,
        };

        await kioskDb.offlineSubmissions.put(offlineRecord);
        const count = await kioskDb.offlineSubmissions.count();
        set({ offlineQueueCount: count });
        toast.info("Check-in saved locally on device. Will auto-sync to reception once reconnected.");
      } catch (dexieErr) {
        console.error("Dexie queue error:", dexieErr);
        toast.error("Could not save submission. Please inform the receptionist.");
        set({ isSubmitting: false });
        return false;
      }
    }

    set({ isSubmitting: false, currentStep: 6 });
    return true;
  },

  drainOfflineQueue: async () => {
    try {
      const queuedItems = await kioskDb.offlineSubmissions.toArray();
      if (!queuedItems || queuedItems.length === 0) {
        set({ offlineQueueCount: 0 });
        return;
      }

      let syncedCount = 0;
      for (const item of queuedItems) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            INTAKE_COLLECTION_ID,
            item.id,
            {
              branchId: item.branchId,
              status: "pending_review",
              submittedAt: item.submittedAt,
              personalInfo: item.personalInfo,
              emergencyContact: item.emergencyContact,
              hmo: item.hmo,
              visitReason: item.visitReason,
              medicalHistory: item.medicalHistory,
              consent: item.consent,
            },
            UNIVERSAL_PERMISSIONS
          );

          await kioskDb.offlineSubmissions.delete(item.id);
          syncedCount++;
        } catch (syncErr) {
          console.warn(`Failed to drain queued item ${item.id}:`, syncErr);
          // Stop draining if network fails again
          break;
        }
      }

      const remainingCount = await kioskDb.offlineSubmissions.count();
      set({ offlineQueueCount: remainingCount });

      if (syncedCount > 0) {
        toast.success(`Synced ${syncedCount} queued check-in${syncedCount > 1 ? "s" : ""} to reception.`);
      }
    } catch (err) {
      console.error("drainOfflineQueue error:", err);
    }
  },

  initKiosk: async () => {
    if (typeof window === "undefined") return;

    // Restore saved branch
    try {
      const savedBranchId = localStorage.getItem("tabasan_kiosk_branch_id");
      const savedBranchName = localStorage.getItem("tabasan_kiosk_branch_name");
      if (savedBranchId) {
        set({
          branchId: savedBranchId,
          branchName: savedBranchName || "Selected Branch",
        });
      }
    } catch {
      // Ignore
    }

    // Set online status
    set({ isOnline: navigator.onLine });

    // Check queued offline submissions
    try {
      const count = await kioskDb.offlineSubmissions.count();
      set({ offlineQueueCount: count });
    } catch {
      // Ignore
    }

    // Fetch branches
    await get().fetchBranches();

    // If online, drain queue
    if (navigator.onLine) {
      await get().drainOfflineQueue();
    }
  },
}));
