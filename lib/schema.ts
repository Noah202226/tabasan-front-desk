/**
 * Front-Desk Patient Record Schema & Integration Types
 * Tabasan Dental Clinic Ecosystem
 * Reference: front_desk_patient_schema.md
 */

// ==========================================
// 1. Core Patient Record (patients Collection)
// ==========================================
export interface PatientRecord {
  /** Primary identifier (UUID v4) - mapped to Appwrite document $id */
  id: string;

  /** Personal & Demographics */
  firstname: string;
  lastname: string;
  middlename?: string;
  gender?: "Male" | "Female" | "Other" | string;
  birthdate?: string; // Format: "YYYY-MM-DD"
  phone: string; // E.g., "09171234567"
  email?: string;
  address?: string;
  occupation?: string;

  /** Patient Classification */
  patientType?: "adult" | "minor" | "mentally_disabled";

  /** Guardian Details (Required if patientType is "minor" or "mentally_disabled") */
  guardianName?: string;
  guardianRelation?: string;
  guardianContact?: string;

  /** Emergency Contact Information (Formatted string: "Name (Relationship - Phone)") */
  emergencyToContact?: string;

  /** HMO / Dental Insurance (JSON stringified object - see PatientHmoDetails) */
  hmoDetails?: string;

  /** Clinical & Front-Desk Notes */
  notes?: string;

  /** Financial & Signature Tracking */
  remainingBal?: number; // Defaults to 0
  signatureId?: string; // Base64 data string or reference ID

  /** Clinic Multi-Branch & Audit Metadata */
  branchId: string; // The branch ID the patient is registered to
  createdBy?: string; // E.g. "front_desk_app" or receptionist user ID
  createdAt: number; // Unix timestamp in milliseconds: Date.now()
  updatedAt: number; // Unix timestamp in milliseconds: Date.now()

  /** Optional Patient Photo */
  photoBase64?: string; // Scaled down compressed JPEG data URL

  /** Serialized backup string */
  data?: string;
}

// ==========================================
// 2. HMO / Insurance Sub-Schema (hmoDetails)
// ==========================================
export interface PatientHmoDetails {
  hasHmo: boolean;
  providerType?: "select" | "custom";
  providerId?: string; // HMO Provider record ID if selected from list
  providerName: string; // E.g., "Maxicare", "Medicard", "Intellicare"
  memberNumber: string; // Card / Policy Number
  relationship?: "Principal" | "Dependent" | "Spouse" | "Child" | string;
  principalName?: string; // Required if relationship is Dependent
  validFrom?: string; // "YYYY-MM-DD"
  validUntil?: string; // "YYYY-MM-DD"
  cardFront?: string; // Compressed Base64 thumbnail or Appwrite file URL
  cardBack?: string; // Compressed Base64 thumbnail or Appwrite file URL
  notes?: string;
}

// ==========================================
// 3. Medical History (medical_history Collection)
// ==========================================
export interface MedicalHistoryRecord {
  /** Document ID (UUID v4) */
  id: string;

  /** Reference to PatientRecord.id */
  patientId: string;

  /** Health Screening Flags */
  isGoodHealth: boolean; // Is patient in good general health?
  isUnderTreatment: boolean; // Currently undergoing medical treatment?
  hasIllnessOperation: boolean; // Past serious illness or operation?
  isHospitalized: boolean; // Has ever been hospitalized?
  isTakingMeds: boolean; // Currently taking medications?
  usesTobacco: boolean; // Smokes or uses tobacco products?
  drinksAlcohol: boolean; // Regularly drinks alcohol?
  usesDrugs: boolean; // Uses prescription or recreational drugs?
  hasAllergies: boolean; // Has allergies to medicine/food/latex?
  isPregnant: boolean; // Female: Currently pregnant?
  isNursing: boolean; // Female: Currently breastfeeding?
  isUsingBirthControl?: boolean;
  birthControlNotes?: string;

  /** Detailed Clinical Notes */
  conditions: string[]; // E.g., ["Hypertension", "Diabetes", "Asthma", "Heart Murmur"]
  allergies: string; // E.g., "Penicillin, Local Anesthesia"
  medications: string; // E.g., "Amlodipine 5mg OD"
  pastSurgeries?: string;
  otherConditions?: string;

  /** Timestamps */
  createdAt: number; // Date.now()
  updatedAt: number; // Date.now()
}

// ==========================================
// 4. Front-Desk Intake Queue Submissions
// (patient_intake_submissions Collection)
// ==========================================
export interface PatientPersonalInfoPayload {
  firstname: string;
  lastname: string;
  middlename?: string;
  gender?: string;
  birthdate?: string; // YYYY-MM-DD
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  patientType?: "adult" | "minor" | "mentally_disabled";
  guardianName?: string;
  guardianRelation?: string;
  guardianContact?: string;
  civilStatus?: string;
}

export interface PatientEmergencyContactPayload {
  contactPerson: string;
  relationship: string;
  contactNumber: string;
}

export interface PatientVisitReasonPayload {
  chiefComplaint: string;
  lastDentalVisit?: string;
  selectedChips: string[];
  painLevel?: number;
  notes?: string;
}

export interface PatientMedicalHistoryPayload {
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
  isUsingBirthControl?: boolean;
  birthControlNotes?: string;
  conditions: string[];
  allergies: string;
  medications: string;
  pastSurgeries?: string;
  otherConditions?: string;
}

export interface PatientConsentPayload {
  agreedToPrivacyPolicy: boolean;
  agreedToTreatmentTerms: boolean;
  signatureBase64: string;
  signedAt: string; // ISO 8601 string
}

export interface PatientIntakeSubmissionRecord {
  /** Clinic Branch ID */
  branchId: string;

  /** Submission Status */
  status: "pending_review" | "approved" | "rejected";

  /** Submission timestamp */
  submittedAt: number; // Date.now()

  /** Serialized JSON string of Personal Demographics */
  personalInfo: string;

  /** Serialized JSON string of Emergency Contact */
  emergencyContact?: string;

  /** Serialized JSON string of HMO Info */
  hmo?: string;

  /** Serialized JSON string of Reason for Visit */
  visitReason?: string;

  /** Serialized JSON string of Medical History */
  medicalHistory?: string;

  /** Serialized JSON string of Consent Agreement */
  consent?: string;

  /** Timestamps */
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// 5. HMO Provider Item (hmo_providers Collection)
// ==========================================
export interface HmoProviderOption {
  id: string;
  name: string;
  code?: string;
  isActive?: boolean;
}
