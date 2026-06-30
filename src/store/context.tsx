import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { appReducer } from './reducer';
import type { AppState, AppAction } from './types';
import { getRecords, saveRecords } from '../utils/storage';
import { getToday } from '../utils/date';

const initialState: AppState = {
  currentDate: getToday(),
  records: getRecords(),
  showForm: false,
  editingRecord: null,
};

const AppStateContext = createContext<AppState>(initialState);
const DispatchContext = createContext<React.Dispatch<AppAction>>(() => {});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    saveRecords(state.records);
  }, [state.records]);

  return (
    <AppStateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}
