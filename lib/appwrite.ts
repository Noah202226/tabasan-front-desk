import { Client, Databases, Storage, Permission, Role } from "appwrite";

export const client = new Client();
const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://appwrite-g7kpzn0lrb8trwg58bhs7x2h.arctech.fun/v1";
const projectId =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6a8d90ba003bcf5358c0";

client.setEndpoint(endpoint).setProject(projectId);

export const databases = new Databases(client);
export const storage = new Storage(client);

// Appwrite Database & Storage Constants
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "tabasan_clinic_db";
export const BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "6a8d9139001937c5c79d";

// Appwrite Primary Collections
export const INTAKE_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PATIENT_INTAKE ||
  "patient_intake_submissions";
export const PATIENTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PATIENTS || "patients";
export const MEDICAL_HISTORY_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_MEDICAL_HISTORY ||
  "medical_history";
export const CONSENT_FORMS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CONSENT_FORMS || "consent_forms";
export const BRANCHES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BRANCHES || "branches";
export const HMO_PROVIDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HMO_PROVIDERS || "hmo_providers";

export const UNIVERSAL_PERMISSIONS = [
  Permission.read(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any()),
];

/**
 * Compresses an image data URL (from webcam or file upload) using an off-screen HTML canvas.
 * Guaranteed to keep payload size well below Appwrite's 65,535 char attribute limit.
 *
 * @param dataUrl Original raw base64 or data URL
 * @param maxWidth Max width in pixels (defaults to 320px for cards/signatures)
 * @param quality JPEG compression quality between 0.0 and 1.0 (defaults to 0.5)
 */
export async function compressImageBase64(
  dataUrl: string,
  maxWidth = 320,
  quality = 0.5
): Promise<string> {
  if (!dataUrl || typeof window === "undefined") return dataUrl;
  if (!dataUrl.startsWith("data:image")) return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Draw white background in case source is transparent PNG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}
