import type { Event } from "@/types/event";
import type { Sermon } from "@/types/sermon";
import type { Location } from "@/types/location";
import type { Locale } from "@/types/common";
import { getLocalizedContent } from "@/lib/utils";
import { getYouTubeEmbedUrl } from "@/lib/integrations/youtube";

const BASE_URL = "https://erelachapelle.fr";

export function churchJsonLd(locations: Location[]) {
  const mainLocation = locations[0];
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: "Église Réformée Évangélique La Chapelle",
    url: BASE_URL,
    description:
      "Communauté chrétienne rassemblée autour de la prédication de la Parole de Dieu",
    address: mainLocation
      ? {
        "@type": "PostalAddress",
        streetAddress: mainLocation.address,
        addressLocality: mainLocation.city,
        postalCode: mainLocation.postalCode,
        addressCountry: "FR",
      }
      : undefined,
    telephone: mainLocation?.contactPhone,
    email: mainLocation?.contactEmail,
    geo: mainLocation?.coordinates
      ? {
        "@type": "GeoCoordinates",
        latitude: mainLocation.coordinates.lat,
        longitude: mainLocation.coordinates.lng,
      }
      : undefined,
  };
}

export function eventJsonLd(event: Event, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: getLocalizedContent(event.title, locale),
    description: getLocalizedContent(event.description, locale),
    startDate: event.startDate,
    endDate: event.endDate ?? undefined,
    url: `${BASE_URL}/${locale}/events/${event.slug}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "Église Réformée Évangélique La Chapelle",
      url: BASE_URL,
    },
  };
}

export function videoJsonLd(sermon: Sermon, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: getLocalizedContent(sermon.title, locale),
    description: sermon.description
      ? getLocalizedContent(sermon.description, locale)
      : undefined,
    uploadDate: sermon.date,
    url: `${BASE_URL}/${locale}/sermons/${sermon.slug}`,
    embedUrl: sermon.youtubeVideoId ? getYouTubeEmbedUrl(sermon.youtubeVideoId) : undefined,
  };
}
