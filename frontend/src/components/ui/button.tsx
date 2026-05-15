import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-soft-sm hover:shadow-glow-sm " +
    "hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] " +
    "focus-visible:ring-brand-400",
  secondary:
    "bg-surface-100 text-ink-800 border border-surface-200 " +
    "hover:bg-surface-200 hover:border-surface-300 hover:shadow-soft-sm " +
    "dark:bg-ink-800 dark:text-surface-200 dark:border-ink-700 dark:hover:bg-ink-700",
  ghost:
    "text-ink-600 hover:bg-surface-100 hover:text-ink-900 " +
    "dark:text-surface-400 dark:hover:bg-ink-800 dark:hover:text-surface-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-soft-sm " +
    "active:scale-[0.98] focus-visible:ring-red-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-lg",
  md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-6 py-3.5 text-base gap-2.5 rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100",
          "select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
