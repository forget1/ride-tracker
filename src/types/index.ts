export interface RideRecord {
  id: string;
  date: string;
  duration: number;
  distance: number;
  expense: number;
  note?: string;
}

export interface DayInfo {
  date: string;
  records: RideRecord[];
}