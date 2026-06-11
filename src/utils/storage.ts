import type { RideRecord } from '../types';

const STORAGE_KEY = 'ride_records';

export const getRecords = (): RideRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecords = (records: RideRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const addRecord = (record: RideRecord): void => {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
};

export const updateRecord = (id: string, updated: Partial<RideRecord>): void => {
  const records = getRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updated };
    saveRecords(records);
  }
};

export const deleteRecord = (id: string): void => {
  const records = getRecords();
  const filtered = records.filter(r => r.id !== id);
  saveRecords(filtered);
};

export const getRecordsByDate = (date: string): RideRecord[] => {
  const records = getRecords();
  return records.filter(r => r.date === date);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};