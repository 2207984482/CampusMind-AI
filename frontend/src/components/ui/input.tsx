import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-ink-700 dark:text-surface-300 mb-1.5 ml-0.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200",
          "bg-white dark:bg-ink-900",
          "border-surface-300 dark:border-ink-700",
          "text-ink-900 dark:text-surface-100",
          "placeholder:text-surface-400 dark:placeholder:text-ink-500",
          "focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400",
          "focus:shadow-glow-sm",
          "hover:border-surface-400 dark:hover:border-ink-600",
          error && "border-red-400 focus:ring-red-400/50 focus:border-red-400",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-surface-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 ml-0.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export { Input };
