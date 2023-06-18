import React, { useEffect, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

import { currentWeek, PositionedEvent, Event } from "../../../constants/data";
import { useGetLessonsQuery, deleteLesson } from "../../../services/lessons";
import { LessonType } from "../../../models";

import CalendarControl from "./CalendarControl";
import CreateLessonForm from "../CreateLessonForm";
import DeleteLessonModal from "./DeleteLessonModal";
import CalendarTable from "./CalendarTable";

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
    useGetLessonsQuery("");

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
          dateRange={currentWeek}
          lessonsData={lessonsData}
          selectedLessonType={selectedLessonType}
          selectedDuration={selectedDuration}
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

      <DeleteLessonModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onSubmit={(lessonId: number) => {
          deleteLesson(lessonId);
          setSelectedEvent(undefined);
        }}
        onCancel={() => setSelectedEvent(undefined)}
      />
    </Grid>
  );
};

export default Calendar;
