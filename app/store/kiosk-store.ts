import { create } from "zustand";
import { Query } from "appwrite";
import {
  databases,
  DATABASE_ID,
  INTAKE_COLLECTION_ID,
  BRANCHES_COLLECTION_ID,
  HMO_PROVIDERS_COLLECTION_ID,
  PATIENTS_COLLECTION_ID,
  MEDICAL_HISTORY_COLLECTION_ID,
  UNIVERSAL_PERMISSIONS,
} from "@/lib/appwrite";
import { kioskDb, type KioskQueuedSubmission } from "@/lib/db";
import type {
  HmoProviderOption,
  PatientHmoDetails,
  PatientPersonalInfoPayload,
  PatientEmergencyContactPayload,
  PatientVisitReasonPayload,
  PatientMedicalHistoryPayload,
  PatientConsentPayload,
  PatientIntakeSubmissionRecord,
} from "@/lib/schema";
import { toast } from "sonner";

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other" | "";
  birthDate: string; // YYYY-MM-DD
  age: number | null;
  contactNumber: string;
  email: string;
  address: string;
  occupation: string;
  civilStatus: string;
  patientType: "adult" | "minor" | "mentally_disabled";
  guardianName: string;
  guardianRelation: string;
  guardianContact: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  contactNumber: string;
}

export interface HmoInfo {
  hasHmo: boolean;
  providerType: "select" | "custom";
  providerId: string;
  providerName: string;
  memberNumber: string;
  relationship: "Principal" | "Dependent" | "Spouse" | "Child" | string;
  principalName: string;
  validFrom: string;
  validUntil: string;
  cardFront: string;
  cardBack: string;
  notes: string;
}

export interface VisitReason {
  chiefComplaint: string;
  lastDentalVisit: string;
  selectedChips: string[];
  painLevel: number;
  notes: string;
}

export interface MedicalHistory {
  isGoodHealth: boolean;
  isUnderTreatment: boolean;
  hasIllnessOperation: boolean;
  isHospitalized: boolean;
  isTakingMeds: boolean;
  usesTobacco: boolean;
  drinksAlcohol: boolean;
  usesDrugs: boolean;
  hasAllergies: boolean;
  isPregnant: boolean;
  isNursing: boolean;
  isUsingBirthControl: boolean;
  birthControlNotes: string;
  conditions: string[];
  allergiesNotes: string;
  currentMedications: string;
  pastSurgeries: string;
  otherConditions: string;
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

export const DEFAULT_HMO_PROVIDERS: HmoProviderOption[] = [
  { id: "maxicare", name: "Maxicare", isActive: true },
  { id: "intellicare", name: "Intellicare", isActive: true },
  { id: "medicard", name: "Medicard", isActive: true },
  { id: "philcare", name: "PhilCare", isActive: true },
  { id: "etiqa", name: "Etiqa", isActive: true },
  { id: "cigna", name: "Cigna", isActive: true },
  { id: "avega", name: "Avega", isActive: true },
  { id: "generali", name: "Generali", isActive: true },
  { id: "valucare", name: "ValuCare", isActive: true },
  { id: "insular", name: "Insular Health Care", isActive: true },
];

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
    patientType: "adult",
    guardianName: "",
    guardianRelation: "",
    guardianContact: "",
  },
  emergencyContact: {
    name: "",
    relationship: "Parent",
    contactNumber: "",
  },
  hmo: {
    hasHmo: false,
    providerType: "select",
    providerId: "",
    providerName: "",
    memberNumber: "",
    relationship: "Principal",
    principalName: "",
    validFrom: "",
    validUntil: "",
    cardFront: "",
    cardBack: "",
    notes: "",
  },
  visitReason: {
    chiefComplaint: "",
    lastDentalVisit: "",
    selectedChips: [],
    painLevel: 0,
    notes: "",
  },
  medicalHistory: {
    isGoodHealth: true,
    isUnderTreatment: false,
    hasIllnessOperation: false,
    isHospitalized: false,
    isTakingMeds: false,
    usesTobacco: false,
    drinksAlcohol: false,
    usesDrugs: false,
    hasAllergies: false,
    isPregnant: false,
    isNursing: false,
    isUsingBirthControl: false,
    birthControlNotes: "",
    conditions: [],
    allergiesNotes: "",
    currentMedications: "",
    pastSurgeries: "",
    otherConditions: "",
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
  hmoProviders: HmoProviderOption[];
  isOnline: boolean;
  isSubmitting: boolean;
  offlineQueueCount: number;
  formData: KioskFormData;

  // Navigation & Settings Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBranch: (branchId: string, branchName: string) => void;
  setIsOnline: (isOnline: boolean) => void;
  setOfflineQueueCount: (count: number) => void;

  // Form Field Update Actions
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateEmergencyContact: (data: Partial<EmergencyContact>) => void;
  updateHmo: (data: Partial<HmoInfo>) => void;
  updateVisitReason: (data: Partial<VisitReason>) => void;
  updateMedicalHistory: (data: Partial<MedicalHistory>) => void;
  updateConsent: (data: Partial<ConsentInfo>) => void;

  // Reset & Submission Pipeline
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
  createPatientDirectly: () => Promise<any>;
  drainOfflineQueue: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  fetchHmoProviders: () => Promise<void>;
  initKiosk: () => Promise<void>;
}

const DEFAULT_BRANCH_ID =
  process.env.NEXT_PUBLIC_KIOSK_DEFAULT_BRANCH_ID || "main";

export const useKioskStore = create<KioskStoreState>((set, get) => ({
  currentStep: 1,
  branchId: DEFAULT_BRANCH_ID,
  branchName: "Main Clinic Branch",
  branches: [
    { id: "main", name: "Tabasan Dental Clinic - San Fernando Main", isMain: true },
    { id: "agoo", name: "Tabasan Dental Clinic - Agoo Branch" },
  ],
  hmoProviders: DEFAULT_HMO_PROVIDERS,
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
    set((state) => {
      const merged = { ...state.formData.personalInfo, ...data };
      // Auto-detect minor patient type if age is computed < 18
      if (typeof merged.age === "number" && merged.age < 18 && merged.patientType === "adult") {
        merged.patientType = "minor";
      }
      return {
        formData: {
          ...state.formData,
          personalInfo: merged,
        },
      };
    }),

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

        await kioskDb.branches.clear();
        for (const b of loadedBranches) {
          await kioskDb.branches.put(b);
        }

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

  fetchHmoProviders: async () => {
    try {
      if (typeof window === "undefined") return;

      const response = await databases.listDocuments(
        DATABASE_ID,
        HMO_PROVIDERS_COLLECTION_ID,
        [Query.limit(100)]
      );

      if (response && response.documents && response.documents.length > 0) {
        const loadedProviders: HmoProviderOption[] = response.documents.map(
          (doc: any) => ({
            id: doc.$id || doc.id,
            name: doc.name || doc.providerName || "HMO Provider",
            code: doc.code || "",
            isActive: doc.isActive !== false,
          })
        );

        set({ hmoProviders: loadedProviders });

        await kioskDb.hmoProviders.clear();
        for (const p of loadedProviders) {
          await kioskDb.hmoProviders.put(p);
        }
        return;
      }
    } catch {
      try {
        const cachedProviders = await kioskDb.hmoProviders.toArray();
        if (cachedProviders && cachedProviders.length > 0) {
          set({ hmoProviders: cachedProviders });
        }
      } catch {
        // Leave defaults
      }
    }
  },

  submitForm: async () => {
    const { formData, branchId, isOnline } = get();
    set({ isSubmitting: true });

    // Constraint 1: Must generate UUID v4
    const submissionId = crypto.randomUUID();
    const now = Date.now();

    // Serialize payloads matching Section 4 & Section 5.B
    const personalInfoPayload: PatientPersonalInfoPayload = {
      firstname: formData.personalInfo.firstName.trim(),
      lastname: formData.personalInfo.lastName.trim(),
      middlename: formData.personalInfo.middleName.trim(),
      gender: formData.personalInfo.gender || "Male",
      birthdate: formData.personalInfo.birthDate || "",
      phone: formData.personalInfo.contactNumber.trim(),
      email: formData.personalInfo.email.trim(),
      address: formData.personalInfo.address.trim(),
      occupation: formData.personalInfo.occupation.trim(),
      patientType: formData.personalInfo.patientType || "adult",
      guardianName: formData.personalInfo.guardianName.trim(),
      guardianRelation: formData.personalInfo.guardianRelation.trim(),
      guardianContact: formData.personalInfo.guardianContact.trim(),
      civilStatus: formData.personalInfo.civilStatus,
    };

    const emergencyContactPayload: PatientEmergencyContactPayload = {
      contactPerson: formData.emergencyContact.name.trim(),
      relationship: formData.emergencyContact.relationship || "Parent",
      contactNumber: formData.emergencyContact.contactNumber.trim(),
    };

    const hmoPayload: PatientHmoDetails = {
      hasHmo: formData.hmo.hasHmo,
      providerType: formData.hmo.providerType,
      providerId: formData.hmo.providerId,
      providerName: formData.hmo.providerName.trim(),
      memberNumber: formData.hmo.memberNumber.trim(),
      relationship: formData.hmo.relationship,
      principalName: formData.hmo.principalName.trim(),
      validFrom: formData.hmo.validFrom,
      validUntil: formData.hmo.validUntil,
      cardFront: formData.hmo.cardFront,
      cardBack: formData.hmo.cardBack,
      notes: formData.hmo.notes.trim(),
    };

    const visitReasonPayload: PatientVisitReasonPayload = {
      chiefComplaint: formData.visitReason.chiefComplaint.trim(),
      lastDentalVisit: formData.visitReason.lastDentalVisit.trim(),
      selectedChips: formData.visitReason.selectedChips || [],
      painLevel: formData.visitReason.painLevel,
      notes: formData.visitReason.notes.trim(),
    };

    const medicalHistoryPayload: PatientMedicalHistoryPayload = {
      isGoodHealth: formData.medicalHistory.isGoodHealth,
      isUnderTreatment: formData.medicalHistory.isUnderTreatment,
      hasIllnessOperation: formData.medicalHistory.hasIllnessOperation,
      isHospitalized: formData.medicalHistory.isHospitalized,
      isTakingMeds: formData.medicalHistory.isTakingMeds,
      usesTobacco: formData.medicalHistory.usesTobacco,
      drinksAlcohol: formData.medicalHistory.drinksAlcohol,
      usesDrugs: formData.medicalHistory.usesDrugs,
      hasAllergies: formData.medicalHistory.hasAllergies,
      isPregnant: formData.medicalHistory.isPregnant,
      isNursing: formData.medicalHistory.isNursing,
      isUsingBirthControl: formData.medicalHistory.isUsingBirthControl,
      birthControlNotes: formData.medicalHistory.birthControlNotes.trim(),
      conditions: formData.medicalHistory.conditions,
      allergies: formData.medicalHistory.allergiesNotes.trim(),
      medications: formData.medicalHistory.currentMedications.trim(),
      pastSurgeries: formData.medicalHistory.pastSurgeries.trim(),
      otherConditions: formData.medicalHistory.otherConditions.trim(),
    };

    const consentPayload: PatientConsentPayload = {
      agreedToPrivacyPolicy: true,
      agreedToTreatmentTerms: true,
      signatureBase64: formData.consent.signature,
      signedAt: new Date(now).toISOString(),
    };

    const submissionPayload: PatientIntakeSubmissionRecord = {
      branchId,
      status: "pending_review",
      submittedAt: now,
      personalInfo: JSON.stringify(personalInfoPayload),
      emergencyContact: JSON.stringify(emergencyContactPayload),
      hmo: JSON.stringify(hmoPayload),
      visitReason: JSON.stringify(visitReasonPayload),
      medicalHistory: JSON.stringify(medicalHistoryPayload),
      consent: JSON.stringify(consentPayload),
      createdAt: now,
      updatedAt: now,
    };

    let pushSuccess = false;

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
        console.warn(
          "Direct push to Appwrite Cloud failed, queuing locally in Dexie:",
          err
        );
      }
    }

    if (!pushSuccess) {
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
          updatedAt: now,
        };

        await kioskDb.offlineSubmissions.put(offlineRecord);
        const count = await kioskDb.offlineSubmissions.count();
        set({ offlineQueueCount: count });
        toast.info(
          "Check-in saved locally on device. Will auto-sync to reception once reconnected."
        );
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

  createPatientDirectly: async () => {
    const { formData, branchId } = get();
    const patientId = crypto.randomUUID();
    const now = Date.now();

    const hmoJson = formData.hmo.hasHmo
      ? JSON.stringify({
          hasHmo: true,
          providerName: formData.hmo.providerName || "",
          memberNumber: formData.hmo.memberNumber || "",
          relationship: formData.hmo.relationship || "Principal",
          principalName: formData.hmo.principalName || "",
          validFrom: formData.hmo.validFrom || "",
          validUntil: formData.hmo.validUntil || "",
        })
      : "";

    const emergencySummary = formData.emergencyContact.name
      ? `${formData.emergencyContact.name.trim()} (${formData.emergencyContact.relationship || "Contact"} - ${formData.emergencyContact.contactNumber.trim()})`
      : "";

    const patientPayload = {
      firstname: formData.personalInfo.firstName.trim(),
      lastname: formData.personalInfo.lastName.trim(),
      middlename: formData.personalInfo.middleName.trim(),
      phone: formData.personalInfo.contactNumber.trim(),
      email: formData.personalInfo.email.trim(),
      gender: formData.personalInfo.gender || "Male",
      birthdate: formData.personalInfo.birthDate || "",
      address: formData.personalInfo.address.trim(),
      occupation: formData.personalInfo.occupation.trim(),
      patientType: formData.personalInfo.patientType || "adult",
      emergencyToContact: emergencySummary,
      hmoDetails: hmoJson,
      notes: formData.visitReason.chiefComplaint.trim(),
      branchId,
      createdBy: "front_desk_app",
      createdAt: now,
      updatedAt: now,
      data: JSON.stringify({
        id: patientId,
        firstname: formData.personalInfo.firstName,
        lastname: formData.personalInfo.lastName,
        middlename: formData.personalInfo.middleName,
        branchId,
        guardianName: formData.personalInfo.guardianName || "",
        guardianRelation: formData.personalInfo.guardianRelation || "",
        guardianContact: formData.personalInfo.guardianContact || "",
        createdAt: now,
      }),
    };

    const patientDoc = await databases.createDocument(
      DATABASE_ID,
      PATIENTS_COLLECTION_ID,
      patientId,
      patientPayload,
      UNIVERSAL_PERMISSIONS
    );

    // Also link medical history record
    const medHistoryId = crypto.randomUUID();
    const medPayload = {
      id: medHistoryId,
      patientId: patientId,
      isGoodHealth: formData.medicalHistory.isGoodHealth,
      isUnderTreatment: formData.medicalHistory.isUnderTreatment,
      hasIllnessOperation: formData.medicalHistory.hasIllnessOperation,
      isHospitalized: formData.medicalHistory.isHospitalized,
      isTakingMeds: formData.medicalHistory.isTakingMeds,
      usesTobacco: formData.medicalHistory.usesTobacco,
      drinksAlcohol: formData.medicalHistory.drinksAlcohol,
      usesDrugs: formData.medicalHistory.usesDrugs,
      hasAllergies: formData.medicalHistory.hasAllergies,
      isPregnant: formData.medicalHistory.isPregnant,
      isNursing: formData.medicalHistory.isNursing,
      isUsingBirthControl: formData.medicalHistory.isUsingBirthControl,
      birthControlNotes: formData.medicalHistory.birthControlNotes,
      conditions: formData.medicalHistory.conditions,
      allergies: formData.medicalHistory.allergiesNotes,
      medications: formData.medicalHistory.currentMedications,
      pastSurgeries: formData.medicalHistory.pastSurgeries,
      otherConditions: formData.medicalHistory.otherConditions,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await databases.createDocument(
        DATABASE_ID,
        MEDICAL_HISTORY_COLLECTION_ID,
        medHistoryId,
        medPayload,
        UNIVERSAL_PERMISSIONS
      );
    } catch (medErr) {
      console.warn("Could not create medical history directly:", medErr);
    }

    return patientDoc;
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
              createdAt: item.createdAt,
              updatedAt: item.updatedAt || item.createdAt,
            },
            UNIVERSAL_PERMISSIONS
          );

          await kioskDb.offlineSubmissions.delete(item.id);
          syncedCount++;
        } catch (syncErr) {
          console.warn(`Failed to drain queued item ${item.id}:`, syncErr);
          break;
        }
      }

      const remainingCount = await kioskDb.offlineSubmissions.count();
      set({ offlineQueueCount: remainingCount });

      if (syncedCount > 0) {
        toast.success(
          `Synced ${syncedCount} queued check-in${syncedCount > 1 ? "s" : ""} to reception.`
        );
      }
    } catch (err) {
      console.error("drainOfflineQueue error:", err);
    }
  },

  initKiosk: async () => {
    if (typeof window === "undefined") return;

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

    set({ isOnline: navigator.onLine });

    try {
      const count = await kioskDb.offlineSubmissions.count();
      set({ offlineQueueCount: count });
    } catch {
      // Ignore
    }

    await get().fetchBranches();
    await get().fetchHmoProviders();

    if (navigator.onLine) {
      await get().drainOfflineQueue();
    }
  },
}));
