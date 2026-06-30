// src/types/index.ts
// src/types/index.ts
export interface PatientData {
  id?: string;
  name: string;
  phone: string;
  tooth: string;
  service: string;
  price: number;
  paid: number;
  date: string;
  appointmentDate?: string | Date;
}
// 