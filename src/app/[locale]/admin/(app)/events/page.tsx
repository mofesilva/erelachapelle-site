"use client";

import { useMemo, useState } from "react";
import { isSameMonth, startOfMonth } from "date-fns";
import { useTranslations } from "next-intl";
import { AddCircleBold, CalendarBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { EventsCalendar } from "../../_components/events/EventsCalendar";
import { EventsTable } from "../../_components/events/EventsTable";
import { EventFormSheet } from "../../_components/events/EventFormSheet";
import { DeleteEventDialog } from "../../_components/events/DeleteEventDialog";
import { useEventsCalendar, useEventMutations } from "../../_features/events/event.controller";
import { eventsOnDay } from "../../_features/events/event.calendar";
import type { EventFormValues } from "../../_features/events/event.schema";
import type { Event } from "../../_features/events/event.type";

export default function EventsAdminPage() {
  const t = useTranslations("admin.events");
  const [month, setMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const calendar = useEventsCalendar(month);
  const mutations = useEventMutations();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState<Event | null>(null);

  // Inclui os eventos de vários dias que só passam pelo dia selecionado, não só os que
  // começam nele — mesma regra do calendário.
  const dayEvents = useMemo(
    () => eventsOnDay(calendar.events, selectedDay),
    [calendar.events, selectedDay]
  );

  // Clicar num dia "de fora" (as sobras do mês anterior/seguinte na grade) leva o mês junto —
  // o fetch cobre só o mês visível, senão o dia apareceria sempre vazio.
  function selectDay(day: Date) {
    setSelectedDay(day);
    if (!isSameMonth(day, month)) setMonth(startOfMonth(day));
  }

  // Trocar de mês arrasta a seleção junto: senão a lista de baixo continuaria mostrando um dia
  // que nem está mais na grade.
  function changeMonth(next: Date) {
    setMonth(next);
    if (!isSameMonth(selectedDay, next)) setSelectedDay(startOfMonth(next));
  }

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(event: Event) {
    setEditing(event);
    setSheetOpen(true);
  }

  async function submit(values: EventFormValues) {
    await (editing ? mutations.update(editing._id, values) : mutations.create(values));
    await calendar.refetch();
  }

  async function handleDelete(id: string) {
    await mutations.remove(id);
    await calendar.refetch();
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={CalendarBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <EventsCalendar
        events={calendar.events}
        loading={calendar.loading}
        loadFailed={calendar.loadFailed}
        month={month}
        onMonthChange={changeMonth}
        selectedDay={selectedDay}
        onSelectDay={selectDay}
        onEditEvent={openEdit}
      />

      <EventsTable
        events={dayEvents}
        loading={calendar.loading}
        loadFailed={calendar.loadFailed}
        selectedDay={selectedDay}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

      <EventFormSheet open={sheetOpen} onOpenChange={setSheetOpen} onSubmit={submit} event={editing} />

      <DeleteEventDialog
        event={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
