export enum RegistrationStatus {
  PENDING = 'pendiente',
  APPROVED = 'aprobado',
  REJECTED = 'rechazado',
}

export interface NationalStructure {
  id: string;
  name: string;
  type: string; // e.g., "Secretaría", "Dirección", "Departamento"
  level: number; // 1 for Federal, 2 for State, 3 for Municipal
  parentStructureId?: string;
  location: string;
  createdAt: number;
}

export interface RegistrationRecord {
  id: string;
  structureId: string;
  registrantName: string;
  registrantEmail: string;
  documentNumber: string;
  status: RegistrationStatus;
  notes?: string;
  submittedAt: number;
  updatedAt: number;
}

export interface DashboardStats {
  totalRegistrations: number;
  pendingValidation: number;
  approvedToday: number;
  registrationsByLevel: Record<number, number>;
}
