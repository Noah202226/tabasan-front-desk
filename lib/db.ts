import Dexie, { type Table } from "dexie";
import type { HmoProviderOption } from "./schema";

export interface KioskQueuedSubmission {
  id: string; // UUID v4
  branchId: string;
  status: "pending_review";
  submittedAt: number;
  personalInfo: string;
  emergencyContact?: string;
  hmo?: string;
  visitReason?: string;
  medicalHistory?: string;
  consent?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface KioskBranchCache {
  id: string;
  name: string;
  isMain?: boolean;
}

export class KioskDexieDB extends Dexie {
  offlineSubmissions!: Table<KioskQueuedSubmission, string>;
  branches!: Table<KioskBranchCache, string>;
  hmoProviders!: Table<HmoProviderOption, string>;

  constructor() {
    super("TabasanKioskOfflineDB");
    this.version(1).stores({
      offlineSubmissions: "id, branchId, status, submittedAt",
      branches: "id, name",
    });
    this.version(2).stores({
      offlineSubmissions: "id, branchId, status, submittedAt",
      branches: "id, name",
      hmoProviders: "id, name, isActive",
    });
  }
}

export const kioskDb = new KioskDexieDB();
