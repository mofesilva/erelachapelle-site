import { cn } from "@/lib/utils";

const variants = {
  gold: { line: "bg-toffee-brown/30", diamond: "text-toffee-brown/50" },
  white: { line: "bg-white/50", diamond: "text-white" },
  black: { line: "bg-carbon-black/20", diamond: "text-carbon-black/30" },
  bordeaux: { line: "bg-night-bordeaux-2/25", diamond: "text-night-bordeaux-2/40" },
  parchment: { line: "bg-parchment/30", diamond: "text-parchment/40" },
} as const;

interface DiamondDividerProps {
  variant?: keyof typeof variants;
  className?: string;
}

export function DiamondDivider({ variant = "gold", className }: DiamondDividerProps) {
  const { line, diamond } = variants[variant];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={cn("h-px w-10", line)} />
      <span className={cn("text-[10px]", diamond)}>◆</span>
      <span className={cn("h-px w-10", line)} />
    </div>
  );
}
