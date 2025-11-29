import React, { createContext, useContext, useState } from "react";
import { Toast, ToastTypes } from "../components/Toast";

interface ToastContextProps {
  showToast: ({
    message,
    type,
    duration,
  }: {
    message: string;
    type?: ToastTypes;
    duration?: number;
  }) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// ✅ Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastDetails, setToastDetails] = useState<{
    message: string;
    type: ToastTypes;
    visible: boolean;
    duration?: number;
  }>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = ({
    message,
    type = "success",
    duration,
  }: {
    message: string;
    type?: ToastTypes;
    duration?: number;
  }) => {
    setToastDetails({ message, type, visible: true, duration: duration });
  };

  const hideToast = () => {
    setToastDetails((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastDetails.visible && (
        <Toast
          message={toastDetails.message}
          onClose={hideToast}
          type={toastDetails.type}
          duration={toastDetails?.duration}
        />
      )}
    </ToastContext.Provider>
  );
};

// ✅ Custom hook for easy usage
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
