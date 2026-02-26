import { cn } from "@/lib/utils";

const variants = {
  gold: { line: "bg-toffee-brown/50", diamond: "text-toffee-brown" },
  white: { line: "bg-white/50", diamond: "text-white" },
  black: { line: "bg-black/50", diamond: "text-black" },
  burgundy: { line: "bg-night-bordeaux-2/50", diamond: "text-night-bordeaux-2" },
} as const;

interface DiamondDividerProps {
  variant?: keyof typeof variants;
  className?: string;
}

export function DiamondDivider({ variant = "gold", className }: DiamondDividerProps) {
  const { line, diamond } = variants[variant];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className={cn("h-px w-12", line)} />
      <span className={cn("text-xs", diamond)}>◆</span>
      <span className={cn("h-px w-12", line)} />
    </div>
  );
}
