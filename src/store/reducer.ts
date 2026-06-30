import type { AppState, AppAction } from './types';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, currentDate: action.payload };

    case 'ADD_RECORD':
      return { ...state, records: [...state.records, action.payload] };

    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload.data } : r
        ),
      };

    case 'DELETE_RECORD':
      return {
        ...state,
        records: state.records.filter(r => r.id !== action.payload),
      };

    case 'OPEN_FORM':
      return { ...state, showForm: true, editingRecord: action.payload ?? null };

    case 'CLOSE_FORM':
      return { ...state, showForm: false, editingRecord: null };

    default:
      return state;
  }
}
