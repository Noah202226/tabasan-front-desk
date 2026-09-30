import Dexie, { type Table } from "dexie";

export interface KioskQueuedSubmission {
  id: string;
  branchId: string;
  status: "pending_review";
  submittedAt: number;
  personalInfo: string;
  emergencyContact: string;
  hmo: string;
  visitReason: string;
  medicalHistory: string;
  consent: string;
  createdAt: number;
}

export interface KioskBranchCache {
  id: string;
  name: string;
  isMain?: boolean;
}

export class KioskDexieDB extends Dexie {
  offlineSubmissions!: Table<KioskQueuedSubmission, string>;
  branches!: Table<KioskBranchCache, string>;

  constructor() {
    super("TabasanKioskOfflineDB");
    this.version(1).stores({
      offlineSubmissions: "id, branchId, status, submittedAt",
      branches: "id, name",
    });
  }
}

export const kioskDb = new KioskDexieDB();
