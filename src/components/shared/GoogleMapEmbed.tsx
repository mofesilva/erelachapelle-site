import { getDirectionsUrl } from "@/lib/integrations/maps";
import type { Coordinates } from "@/types/common";
import { MapPin } from "lucide-react";

interface GoogleMapEmbedProps {
  address: string;
  coordinates: Coordinates;
  directionsLabel?: string;
}

export function GoogleMapEmbed({
  address,
  coordinates,
  directionsLabel = "Itinéraire",
}: GoogleMapEmbedProps) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const directionsHref = getDirectionsUrl(coordinates.lat, coordinates.lng);

  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-lg border">
        <iframe
          src={mapSrc}
          title={address}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <MapPin className="h-4 w-4" />
        {directionsLabel}
      </a>
    </div>
  );
}
