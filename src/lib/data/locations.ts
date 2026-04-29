import type { Location } from "@/types/location";

export const LOCATIONS: Location[] = [
  {
    _id: "loc-saint-hippolyte",
    name: "La Chapelle",
    address: "Bd des Remparts",
    city: "St Hippolyte du Fort",
    postalCode: "30170",
    country: "France",
    coordinates: { lat: 43.9622486, lng: 3.8569039 },
    worshipSchedule: {
      fr: "Dimanche 10h00",
      pt: "Domingo 10h00",
      en: "Sunday 10:00 AM",
    },
    contactEmail: "erelachapelle@orange.fr",
    contactPhone: "04 66 77 20 58",
    active: true,
  },
];

export function getLocations(): Location[] {
  return LOCATIONS.filter((l) => l.active);
}

export function getLocationById(id: string): Location | null {
  return LOCATIONS.find((l) => l._id === id) ?? null;
}
