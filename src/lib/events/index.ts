export type { Event, EventType, RegistrationResult } from "./model";
export { EVENT_TYPES, eventRegistrationSchema } from "./model";
export { mapEvent, mapEvents } from "./mapper";
export { eventsCollection, EVENTS_COLLECTION } from "./collection";
export {
    getEvents,
    getRecentEvents,
    getAllEvents,
    getEventBySlug,
    getEventById,
    filterEvents,
    getEventTypes,
    createEvent,
    updateEvent,
    deleteEvent,
} from "./service";
export { registerForEvent } from "./controller";
