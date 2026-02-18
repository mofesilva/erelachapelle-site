import type { Coordinates, MultilingualText } from "./common";

export interface Location {
  _id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
  worshipSchedule: MultilingualText;
  contactPhone?: string;
  contactEmail?: string;
  active: boolean;
}
