# Front-Desk Patient Record Schema & Integration Guide
**Tabasan Dental Clinic Ecosystem**

This document provides the complete data contracts, schemas, Appwrite Cloud credentials, and integration specifications needed for the new **Front Desk App (`app.tabasan-front-desk`)** to register new patients and connect seamlessly with the main **Tabasan Clinic (`tabasan-clinic`)** management dashboard.

---

## 1. Appwrite Cloud Connection Configuration

Configure your environment variables in the Front Desk App using these credentials:

```env
# Appwrite Cloud Backend Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://appwrite-g7kpzn0lrb8trwg58bhs7x2h.arctech.fun/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID="6a8d90ba003bcf5358c0"
NEXT_PUBLIC_APPWRITE_PROJECT_NAME="tabasan-dental"
NEXT_PUBLIC_APPWRITE_DATABASE_ID="tabasan_clinic_db"
NEXT_PUBLIC_APPWRITE_BUCKET_ID="6a8d9139001937c5c79d"
```

### Primary Collections

| Collection Name | Collection ID | Purpose |
| :--- | :--- | :--- |
| **Patients** | `patients` | Primary directory of registered clinic patients |
| **Medical History** | `medical_history` | Detailed medical questionnaires, allergies, & conditions |
| **Patient Intake Submissions** | `patient_intake_submissions` | Real-time intake queue for kiosk self-registration review |
| **Consent Forms** | `consent_forms` | Signed Republic Act 10173 (Data Privacy Act) agreements |
| **Branches** | `branches` | Clinic locations (San Fernando, Agoo, etc.) |
| **HMO Providers** | `hmo_providers` | Supported dental insurance providers |

---

## 2. Core Patient Record Schema (`patients` Collection)

### TypeScript Data Contract

```typescript
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

  /** HMO / Dental Insurance (JSON stringified object - see HMO schema below) */
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
}
```

### Appwrite Attribute Specifications

When writing directly to the `patients` collection in Appwrite, your document must match the registered attributes:

| Field Name | Type | Size / Limits | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`firstname`** | String | 255 | **Yes** | Patient first name |
| **`lastname`** | String | 255 | **Yes** | Patient last name |
| **`phone`** | String | 100 | **Yes** | Primary contact phone number |
| **`branchId`** | String | 255 | **Yes** | Clinic branch identifier |
| **`middlename`** | String | 255 | No | Middle name or middle initial |
| **`email`** | String | 255 | No | Email address |
| **`gender`** | String | 50 | No | Gender (`Male`, `Female`, `Other`) |
| **`birthdate`** | String | 100 | No | Birthdate in `YYYY-MM-DD` |
| **`address`** | String | 1000 | No | Full residential address |
| **`occupation`** | String | 255 | No | Occupation or school |
| **`patientType`** | String | 100 | No | `adult`, `minor`, `mentally_disabled` |
| **`emergencyToContact`** | String | 255 | No | Emergency contact person summary |
| **`hmoDetails`** | String | 1000 | No | Serialized JSON string of HMO info |
| **`notes`** | String | 5000 | No | Clinical or intake notes |
| **`createdBy`** | String | 255 | No | Identifier of author (e.g. `front_desk_app`) |
| **`createdAt`** | Integer | - | No | Unix timestamp in ms (`Date.now()`) |
| **`updatedAt`** | Integer | - | No | Unix timestamp in ms (`Date.now()`) |
| **`data`** | String | 65,535 | No | Full serialized JSON backup of the record |

---

## 3. Connected Sub-Schemas

### A. HMO / Insurance Object (`hmoDetails`)
In the `patients` collection, HMO data is stored inside `hmoDetails` as a serialized JSON string:

```typescript
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
```

### B. Medical History Record (`medical_history` Collection)
Tabasan Clinic links a medical questionnaire to each patient record via `patientId`:

```typescript
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
```

---

## 4. Front-Desk Intake Queue Schema (`patient_intake_submissions`)

> **⭐ Recommended Integration Pattern:**
> Tabasan Clinic has a built-in **Realtime Reception Queue** (`useRealtimeIntake`). When a front-desk tablet submits a document to `patient_intake_submissions`, the reception dashboard chimes immediately, displays the patient's card photos and health responses for verification, and generates the `patients`, `medical_history`, and `consent_forms` records upon clicking **Approve**.

If using this workflow, submit to collection `patient_intake_submissions`:

```typescript
export interface PatientIntakeSubmissionRecord {
  /** Clinic Branch ID */
  branchId: string;

  /** Submission Status */
  status: "pending_review" | "approved" | "rejected"; // Defaults to "pending_review"

  /** Submission timestamp */
  submittedAt: number; // Date.now()

  /** Serialized JSON string of Personal Demographics */
  personalInfo: string; // JSON: { firstname, lastname, middlename, phone, email, gender, birthdate, address, occupation, patientType, guardianName, guardianRelation, guardianContact }

  /** Serialized JSON string of Emergency Contact */
  emergencyContact?: string; // JSON: { contactPerson, relationship, contactNumber }

  /** Serialized JSON string of HMO Info */
  hmo?: string; // JSON of PatientHmoDetails

  /** Serialized JSON string of Reason for Visit */
  visitReason?: string; // JSON: { chiefComplaint, lastDentalVisit, selectedChips: string[] }

  /** Serialized JSON string of Medical History */
  medicalHistory?: string; // JSON: { isGoodHealth, isUnderTreatment, medications, hasAllergies, allergies, conditions: string[], ... }

  /** Serialized JSON string of Consent Agreement */
  consent?: string; // JSON: { agreedToPrivacyPolicy: true, agreedToTreatmentTerms: true, signatureBase64: string, signedAt: string }

  /** Timestamps */
  createdAt: number;
  updatedAt: number;
}
```

---

## 5. Implementation Code Examples

### A. Direct Patient Registration (`patients` collection)

```typescript
import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://appwrite-g7kpzn0lrb8trwg58bhs7x2h.arctech.fun/v1")
  .setProject("6a8d90ba003bcf5358c0");

const databases = new Databases(client);
const DATABASE_ID = "tabasan_clinic_db";
const PATIENTS_COLLECTION_ID = "patients";

export async function createPatientDirectly(formData: any, branchId: string) {
  const patientId = crypto.randomUUID();
  const now = Date.now();

  const hmoJson = formData.hasHmo
    ? JSON.stringify({
        hasHmo: true,
        providerName: formData.hmoProviderName || "",
        memberNumber: formData.hmoMemberNumber || "",
        relationship: formData.hmoRelationship || "Principal",
        principalName: formData.hmoPrincipalName || "",
        validFrom: formData.hmoValidFrom || "",
        validUntil: formData.hmoValidUntil || "",
      })
    : "";

  const emergencySummary = formData.emergencyContactName
    ? `${formData.emergencyContactName} (${formData.emergencyRelationship || "Contact"} - ${formData.emergencyPhone || ""})`
    : "";

  const payload = {
    firstname: formData.firstname.trim(),
    lastname: formData.lastname.trim(),
    middlename: (formData.middlename || "").trim(),
    phone: formData.phone.trim(),
    email: (formData.email || "").trim(),
    gender: formData.gender || "Male",
    birthdate: formData.birthdate || "",
    address: (formData.address || "").trim(),
    occupation: (formData.occupation || "").trim(),
    patientType: formData.patientType || "adult",
    emergencyToContact: emergencySummary,
    hmoDetails: hmoJson,
    notes: (formData.notes || "").trim(),
    branchId: branchId,
    createdBy: "front_desk_app",
    createdAt: now,
    updatedAt: now,
    // Serialized backup string
    data: JSON.stringify({
      id: patientId,
      firstname: formData.firstname,
      lastname: formData.lastname,
      middlename: formData.middlename,
      branchId,
      guardianName: formData.guardianName || "",
      guardianRelation: formData.guardianRelation || "",
      guardianContact: formData.guardianContact || "",
      createdAt: now,
    }),
  };

  const document = await databases.createDocument(
    DATABASE_ID,
    PATIENTS_COLLECTION_ID,
    patientId,
    payload
  );

  return document;
}
```

### B. Front-Desk Intake Queue Submission (`patient_intake_submissions` collection)

```typescript
import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://appwrite-g7kpzn0lrb8trwg58bhs7x2h.arctech.fun/v1")
  .setProject("6a8d90ba003bcf5358c0");

const databases = new Databases(client);
const DATABASE_ID = "tabasan_clinic_db";
const INTAKE_COLLECTION_ID = "patient_intake_submissions";

export async function submitIntakeForm(intakeData: any, branchId: string) {
  const submissionId = crypto.randomUUID();
  const now = Date.now();

  const payload = {
    branchId: branchId,
    status: "pending_review",
    submittedAt: now,
    personalInfo: JSON.stringify({
      firstname: intakeData.firstname,
      lastname: intakeData.lastname,
      middlename: intakeData.middlename || "",
      gender: intakeData.gender || "",
      birthdate: intakeData.birthdate || "",
      phone: intakeData.phone,
      email: intakeData.email || "",
      address: intakeData.address || "",
      occupation: intakeData.occupation || "",
      patientType: intakeData.patientType || "adult",
      guardianName: intakeData.guardianName || "",
      guardianRelation: intakeData.guardianRelation || "",
      guardianContact: intakeData.guardianContact || "",
    }),
    emergencyContact: JSON.stringify({
      contactPerson: intakeData.emergencyContactName || "",
      relationship: intakeData.emergencyRelationship || "",
      contactNumber: intakeData.emergencyContactNumber || "",
    }),
    hmo: JSON.stringify(intakeData.hmo || { hasHmo: false }),
    visitReason: JSON.stringify({
      chiefComplaint: intakeData.chiefComplaint || "",
      lastDentalVisit: intakeData.lastDentalVisit || "",
      selectedChips: intakeData.selectedChips || [],
    }),
    medicalHistory: JSON.stringify(intakeData.medicalHistory || { isGoodHealth: true }),
    consent: JSON.stringify({
      agreedToPrivacyPolicy: true,
      agreedToTreatmentTerms: true,
      signatureBase64: intakeData.signatureBase64 || "",
      signedAt: new Date(now).toISOString(),
    }),
    createdAt: now,
    updatedAt: now,
  };

  const document = await databases.createDocument(
    DATABASE_ID,
    INTAKE_COLLECTION_ID,
    submissionId,
    payload
  );

  return document;
}
```

---

## 6. Critical Engineering Constraints

1. **Document ID Generation:**
   - Always generate a **UUID v4** string (e.g. `crypto.randomUUID()`) to use as the document ID in Appwrite (`databases.createDocument(dbId, colId, uuid, payload)`). Tabasan Clinic's local IndexedDB (Dexie) cache relies on UUID primary keys.
2. **Appwrite String Limit (65,535 chars):**
   - Do **not** pass high-resolution camera images directly into the `data` attribute. Compress card captures or profile photos using HTML Canvas (e.g., max width 300px, JPEG quality 50%), or upload the raw image files to the Appwrite Storage Bucket (`6a8d9139001937c5c79d`) and store the resulting file URL.
3. **Date & Timestamp Formats:**
   - Always format calendar dates (`birthdate`, `validFrom`, `validUntil`) as standard `YYYY-MM-DD`.
   - Always format timestamps (`createdAt`, `updatedAt`, `submittedAt`) as integer milliseconds (`Date.now()`).
4. **Branch Assignment:**
   - Every patient record must have a valid `branchId`. The front desk app should provide a branch selector or configuration setting (e.g., San Fernando or Agoo branch) so records automatically fall under that branch's scope.
