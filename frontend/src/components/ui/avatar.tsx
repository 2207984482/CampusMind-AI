import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" };

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeStyles[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 flex items-center justify-center font-medium",
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
