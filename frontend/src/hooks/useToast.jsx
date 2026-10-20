import { useState, useCallback } from "react";
import Toast from "../components/Toast";

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const ToastEl = toast
    ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
    : null;

  return { show, ToastEl };
}
