import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4 mx-auto max-w-md", className)}>
      <span className="text-[#8C5E35] text-xs">◆</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8C5E35]/40 to-transparent" />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#171717]/40 whitespace-nowrap">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8C5E35]/40 to-transparent" />
      <span className="text-[#8C5E35] text-xs">◆</span>
    </div>
  );
}
