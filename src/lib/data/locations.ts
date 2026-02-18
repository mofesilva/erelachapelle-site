import type { Location } from "@/types/location";

export const LOCATIONS: Location[] = [
  {
    _id: "loc-saint-hippolyte",
    name: "Saint-Hippolyte-du-Fort",
    address: "Place de la Mairie",
    city: "Saint-Hippolyte-du-Fort",
    postalCode: "30170",
    country: "France",
    coordinates: { lat: 43.9667, lng: 3.85 },
    worshipSchedule: {
      fr: "Dimanche 10h30",
      pt: "Domingo 10h30",
      en: "Sunday 10:30 AM",
    },
    active: true,
  },
];

export function getLocations(): Location[] {
  return LOCATIONS.filter((l) => l.active);
}

export function getLocationById(id: string): Location | null {
  return LOCATIONS.find((l) => l._id === id) ?? null;
}
