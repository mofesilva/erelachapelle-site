import type { EventLocation } from "./event.type";

/**
 * Não existe geocodificação em lugar nenhum do projeto — nada converte endereço em lat/lng,
 * mas o schema da API exige `location.coordinates`. Só existe uma sede hoje, então o
 * formulário usa ela como padrão em vez de pedir coordenadas na mão; `customAddress` cobre
 * a exceção de um evento em outro lugar. Mesmos dados já usados no mapa do site público
 * (`src/lib/data/locations.ts`, `GatheringSection`, `Footer`) — não é valor inventado aqui.
 */
export const DEFAULT_LOCATION: EventLocation = {
  name: "La Chapelle",
  address: "Bd des Remparts, 30170 St Hippolyte du Fort, France",
  coordinates: { lat: 43.9622486, lng: 3.8569039 },
};
