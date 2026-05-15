import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "glass" | "elevated";
  glow?: boolean;
}

const paddingStyles = { none: "", sm: "p-3", md: "p-5", lg: "p-8" };

const variantStyles: Record<string, string> = {
  default: "border-surface-200 bg-white dark:border-ink-800 dark:bg-ink-900 shadow-soft-sm",
  glass: "glass",
  elevated: "border-surface-200 bg-white dark:border-ink-800 dark:bg-ink-900 shadow-soft-lg",
};

export function Card({
  className,
  padding = "md",
  variant = "default",
  glow = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        variantStyles[variant],
        glow && "hover:shadow-glow-sm",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-ink-900 dark:text-surface-100 tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-ink-500 dark:text-surface-400 leading-relaxed", className)}
      {...props}
    />
  );
}
