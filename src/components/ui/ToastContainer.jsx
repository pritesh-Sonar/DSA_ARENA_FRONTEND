import { useState, useEffect, useCallback } from "react";
import { toastManager } from "../../utils/toastManager";
import Toast from "./Toast";

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => dismiss(toast.id), toast.duration);
    });
    return unsubscribe;
  }, [dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismiss(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
