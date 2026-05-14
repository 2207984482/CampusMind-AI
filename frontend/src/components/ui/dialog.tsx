"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div ref={overlayRef} className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl",
          "border border-gray-200 dark:border-gray-800",
          className
        )}
      >
        {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>}
        {children}
      </div>
    </div>
  );
}
