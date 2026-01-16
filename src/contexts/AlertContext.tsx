'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import AlertBox from '@/components/AlertBox';

interface AlertOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  showCancel?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<(AlertOptions & { isOpen: boolean }) | null>(null);

  const showAlert = (options: AlertOptions) => {
    setAlert({ ...options, isOpen: true });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <AlertBox
          title={alert.title}
          message={alert.message}
          type={alert.type}
          isOpen={alert.isOpen}
          onClose={closeAlert}
          onConfirm={alert.onConfirm}
          showCancel={alert.showCancel}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}