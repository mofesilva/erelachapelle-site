import { getDirectionsUrl } from "@/lib/integrations/maps";
import type { Coordinates } from "@/types/common";
import { MapPointBold } from "solar-icon-set";

interface GoogleMapEmbedProps {
  address: string;
  coordinates: Coordinates;
  directionsLabel?: string;
  showDirections?: boolean;
}

export function GoogleMapEmbed({
  address,
  coordinates,
  directionsLabel = "Itinéraire",
  showDirections = true,
}: GoogleMapEmbedProps) {
  const mapSrc = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&output=embed`;
  const directionsHref = getDirectionsUrl(coordinates.lat, coordinates.lng);

  return (
    <div className="space-y-4">
      <div className="h-[480px] overflow-hidden">
        <iframe
          src={mapSrc}
          title={address}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {showDirections && (
        <div className="flex justify-end">
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <MapPointBold size={16} />
            {directionsLabel}
          </a>
        </div>
      )}
    </div>
  );
}
