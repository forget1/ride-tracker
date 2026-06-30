import type { RideRecord } from '../types';

export interface AppState {
  currentDate: string;
  records: RideRecord[];
  showForm: boolean;
  editingRecord: RideRecord | null;
}

export type AppAction =
  | { type: 'SET_DATE'; payload: string }
  | { type: 'ADD_RECORD'; payload: RideRecord }
  | { type: 'UPDATE_RECORD'; payload: { id: string; data: Partial<RideRecord> } }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'OPEN_FORM'; payload?: RideRecord }
  | { type: 'CLOSE_FORM' };
