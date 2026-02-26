import { cn } from "@/lib/utils";

const variants = {
    gold: { line: "bg-toffee-brown/50", cross: "text-toffee-brown" },
    white: { line: "bg-white/50", cross: "text-white" },
    black: { line: "bg-black/50", cross: "text-black" },
    burgundy: { line: "bg-night-bordeaux-2/50", cross: "text-night-bordeaux-2" },
} as const;

interface CrossDividerProps {
    variant?: keyof typeof variants;
    className?: string;
}

export function CrossDivider({ variant = "white", className }: CrossDividerProps) {
    const { line, cross } = variants[variant];

    return (
        <div className={cn("flex items-center gap-5", className)}>
            <span className={cn("h-px w-24", line)} />
            <span className={cn("text-2xl", cross)}>✟</span>
            <span className={cn("h-px w-24", line)} />
        </div>
    );
}
