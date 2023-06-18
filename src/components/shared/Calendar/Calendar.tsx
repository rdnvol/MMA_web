import React, { useEffect, useState } from "react";
import {
  HStack,
  Box,
  VStack,
  Circle,
  Flex,
  Grid,
  GridItem,
  useMediaQuery,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { format, isToday } from "date-fns";

import {
  currentWeek,
  timeData,
  PositionedEvent,
  dailyBounds,
  slotDuration,
  getEventsByDateFromLessons,
  Event,
} from "../../../constants/data";
import { getPositionedEvents, getFreeSlots } from "../../../utils/calendar";
import { useGetLessonsQuery, deleteLesson } from "../../../services/lessons";
import { LessonType } from "../../../models";

import LessonCard from "../../base/LessonCard";
import EmptySlotCard from "../../base/EmptySlotCard";
import TimeBox from "../../base/TimeBox";
import CalendarControl from "./CalendarControl";
import CreateLessonForm from "../CreateLessonForm";
import DeleteLessonModal from "./DeleteLessonModal";

const cellHeight = 40;

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

  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const cellWidth = isLargerThan600 ? 160 : 80;

  const [filters, setFilters] = useState<FiltersParams>({ coaches: [] });
  const [searchParams] = useSearchParams();

  const { data: lessonsData = {}, refetch: refetchLessons } =
    useGetLessonsQuery("");

  useEffect(() => {
    const coaches = searchParams.getAll("coaches").map((coachId) => +coachId);

    setFilters({ coaches });
  }, [searchParams]);

  const renderHeader = (header: string | Date) => (
    <Flex
      h={`${cellHeight}px`}
      alignItems="center"
      gap={2}
      position="sticky"
      top={0}
      bg="white"
      zIndex={2}
      w="full"
      justifyContent="center"
      borderColor="gray.200"
      borderBottomWidth={1}
    >
      {typeof header === "string" ? (
        header
      ) : (
        <>
          {format(header, "E")}
          <Circle
            size="28px"
            bg={isToday(header) ? "orange.600" : ""}
            color={isToday(header) ? "white" : ""}
          >
            {format(header, "dd")}
          </Circle>
        </>
      )}
    </Flex>
  );

  const renderDateColumn = (date: Date) => {
    const eventsByDate = getEventsByDateFromLessons(date, lessonsData);
    const positionedEvents = getPositionedEvents(
      eventsByDate,
      dailyBounds,
      slotDuration
    );
    const freeSlots = selectedLessonType
      ? getFreeSlots(
          eventsByDate,
          selectedLessonType,
          selectedDuration,
          date,
          dailyBounds
        )
      : [];

    return (
      <VStack key={date.toDateString()} spacing={0} position="relative">
        {renderHeader(date)}
        <Box
          position="relative"
          w={`${cellWidth}px`}
          h={`${cellHeight * timeData.length}px`}
        >
          {timeData.map((time) => (
            <TimeBox key={time} />
          ))}
          {positionedEvents.map(renderLesson)}
          {freeSlots.map(renderEmptySlot)}
        </Box>
      </VStack>
    );
  };

  const renderLesson = (positionedEvent: PositionedEvent) => {
    return (
      <LessonCard
        key={positionedEvent.id}
        position={positionedEvent.position}
        coaches={positionedEvent.coaches}
        label={positionedEvent.label}
        lessonType={positionedEvent.lessonType}
        isFloating={positionedEvent.isFloating}
        coachOrder={positionedEvent.coachOrder}
        selectedCoaches={filters.coaches}
        onClick={() => setSelectedEvent(positionedEvent)}
      />
    );
  };

  const renderEmptySlot = (positionedEvent: PositionedEvent) => {
    return (
      <EmptySlotCard
        position={positionedEvent.position}
        onClick={() => {
          setSelectedFreeSlot(positionedEvent);
        }}
        isSelected={
          selectedFreeSlot?.date === positionedEvent.date &&
          selectedFreeSlot?.startTime === positionedEvent.startTime
        }
      />
    );
  };

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
        <HStack spacing={0} alignItems="flex-start" position="relative">
          <VStack spacing={0} position="sticky" zIndex={2} left={0} bg="white">
            {renderHeader("Time")}
            {timeData.map((time) => (
              <TimeBox key={time}>{time}</TimeBox>
            ))}
          </VStack>
          {currentWeek.map(renderDateColumn)}
        </HStack>
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
