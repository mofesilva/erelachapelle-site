import type { SolarIcon } from "@/types/common";

interface CommunityGroupCardProps {
    icon: SolarIcon;
    name: string;
    description: string;
}

export function CommunityGroupCard({ icon: Icon, name, description }: CommunityGroupCardProps) {
    return (
        <div className="group flex gap-5 pb-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-powder-petal transition-colors duration-300 group-hover:bg-toffee-brown/15">
                <Icon size={20} color="var(--toffee-brown)" />
            </div>
            <div className="pt-1">
                <h5 className="font-serif font-bold text-carbon-black">
                    {name}
                </h5>
                <p className="mt-2 leading-relaxed text-coffee-bean/70">
                    {description}
                </p>
            </div>
        </div>
    );
}
