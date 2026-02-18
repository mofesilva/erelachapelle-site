import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface LocationCardProps {
  image?: string;
  icon?: LucideIcon;
  name: string;
  address: string;
  schedule: string;
}

export function LocationCard({
  image,
  icon: Icon = MapPin,
  name,
  address,
  schedule,
}: LocationCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_16px_60px_rgba(106,13,30,0.15)] hover:-translate-y-1">
      {/* Image or Placeholder */}
      <div className="relative h-56 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#643036] via-[#3D000A] to-[#643036]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full border border-white/10" />
                <div className="absolute -inset-12 rounded-full border border-white/5" />
                <Icon className="h-12 w-12 text-white/40" />
              </div>
            </div>
          </div>
        )}
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-serif text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Address */}
        <div className="flex items-start gap-3 text-sm text-[#171717]/70">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#643036]" />
          <span>{address}</span>
        </div>
        
        {/* Schedule */}
        <div className="mt-3 flex items-center gap-3">
          <Clock className="h-4 w-4 flex-shrink-0 text-[#8C5E35]" />
          <span className="text-base font-semibold text-[#3D000A]">{schedule}</span>
        </div>

        {/* Decorative bottom accent */}
        <div className="mt-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#8C5E35] to-[#D1A594]" />
      </div>
    </div>
  );
}
