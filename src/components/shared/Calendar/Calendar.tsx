import React, { useEffect, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

import { PositionedEvent, Event, getDateRange } from "../../../constants/data";
import { useGetLessonsQuery } from "../../../services/lessons";
import { LessonType } from "../../../models";

import CalendarControl from "./CalendarControl";
import CreateLessonForm from "../CreateLessonForm";
import LessonProfileModal from "./LessonProfileModal";
import CalendarTable from "./CalendarTable";
import config from "../../../config";

type FiltersParams = {
  coaches: number[];
};

export const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedLessonType, setSelectedLessonType] = useState<
    LessonType | undefined
  >();
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedFreeSlot, setSelectedFreeSlot] = useState<
    PositionedEvent | undefined
  >();

  const [filters, setFilters] = useState<FiltersParams>({ coaches: [] });
  const [searchParams] = useSearchParams();

  const { data: lessonsData = {}, refetch: refetchLessons } =
    useGetLessonsQuery(searchParams.toString(), {
      pollingInterval: config.pollingInterval,
    });

  useEffect(() => {
    const coaches = searchParams.getAll("coaches").map((coachId) => +coachId);

    setFilters({ coaches });
  }, [searchParams]);

  const showFreeSlots = (lessonType: LessonType, duration: number): void => {
    setSelectedLessonType(lessonType);
    setSelectedDuration(duration);
    setSelectedFreeSlot(undefined);
  };

  const submitCreateLesson = () => {
    cancelCreateLesson();
    refetchLessons();
  };

  const cancelCreateLesson = () => {
    setSelectedLessonType(undefined);
    setSelectedDuration(0);
    setSelectedFreeSlot(undefined);
  };

  const closeLessonProfileModal = () => {
    setSelectedEvent(undefined);
  };

  return (
    <Grid
      templateAreas={`"control"
                      "calendar"
                      "form"`}
      gridTemplateRows={"60px 1fr 50px"}
      gridTemplateColumns={"1fr"}
      h="100dvh"
      overflowY="hidden"
      gap="1"
      color="blackAlpha.700"
    >
      <GridItem pl="2" area={"control"} boxShadow="md" overflow="hidden">
        <CalendarControl />
      </GridItem>

      <GridItem area={"calendar"} overflowX="scroll" h="100%">
        <CalendarTable
          dateRange={getDateRange(
            searchParams.get("startDate") || "",
            searchParams.get("endDate") || ""
          )}
          lessonsData={lessonsData}
          selectedLessonType={selectedLessonType}
          selectedDuration={selectedDuration}
          selectedCoaches={filters.coaches}
          selectedFreeSlot={selectedFreeSlot}
          onSelectFreeSlot={setSelectedFreeSlot}
          onSelectLesson={setSelectedEvent}
        />
      </GridItem>

      <CreateLessonForm
        selectedFreeSlot={selectedFreeSlot}
        onShowFreeSlots={showFreeSlots}
        onSubmit={submitCreateLesson}
        onCancel={cancelCreateLesson}
      />

      <LessonProfileModal
        lessonId={selectedEvent?.id}
        isOpen={!!selectedEvent}
        onChange={refetchLessons}
        onClose={closeLessonProfileModal}
      />
    </Grid>
  );
};

export default Calendar;
