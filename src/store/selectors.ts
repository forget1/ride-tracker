import type { RideRecord } from '../types';

export function selectRecordsByDate(records: RideRecord[], date: string): RideRecord[] {
  return records.filter(r => r.date === date);
}

export function selectTotals(records: RideRecord[], date: string) {
  const filtered = selectRecordsByDate(records, date);
  return {
    duration: filtered.reduce((sum, r) => sum + r.duration, 0),
    distance: filtered.reduce((sum, r) => sum + r.distance, 0),
    expense: filtered.reduce((sum, r) => sum + r.expense, 0),
  };
}
