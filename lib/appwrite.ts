import { Client, Databases, Permission, Role } from "appwrite";

export const client = new Client();
const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://appwrite-g7kpzn0lrb8trwg58bhs7x2h.arctech.fun/v1";
const projectId =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6a8d90ba003bcf5358c0";

client.setEndpoint(endpoint).setProject(projectId);

export const databases = new Databases(client);
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "tabasan_clinic_db";
export const INTAKE_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PATIENT_INTAKE || "patient_intake_submissions";
export const BRANCHES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BRANCHES || "branches";

export const UNIVERSAL_PERMISSIONS = [
  Permission.read(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any()),
];
