import Image from "next/image";
import { MapPointBold, ClockCircleBold } from "solar-icon-set";
import type { SolarIcon } from "@/types/common";

interface LocationCardProps {
  image?: string;
  icon?: SolarIcon;
  name: string;
  address: string;
  schedule: string;
}

export function LocationCard({
  image,
  icon: Icon = MapPointBold,
  name,
  address,
  schedule,
}: LocationCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_16px_60px_rgba(106,13,30,0.15)] hover:-translate-y-1">
      {/* Image or Placeholder */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-night-bordeaux-2 via-rich-mahogany to-night-bordeaux-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full border border-white/10" />
                <div className="absolute -inset-12 rounded-full border border-white/5" />
                <Icon size={48} color="rgba(255,255,255,0.4)" />
              </div>
            </div>
          </div>
        )}
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h5 className="font-serif font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {name}
          </h5>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Address */}
        <div className="flex items-start gap-3 text-sm text-black/70">
          <MapPointBold size={16} color="var(--night-bordeaux-2)" className="mt-0.5 flex-shrink-0" />
          <span>{address}</span>
        </div>

        {/* Schedule */}
        <div className="mt-3 flex items-center gap-3">
          <ClockCircleBold size={16} color="var(--toffee-brown)" className="flex-shrink-0" />
          <span className="text-base font-semibold text-rich-mahogany">{schedule}</span>
        </div>

        {/* Decorative bottom accent */}
        <div className="mt-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-toffee-brown to-powder-petal" />
      </div>
    </div>
  );
}
