import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
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
  COACHES,
  lessonTypesData,
  addLesson,
  updateCoachesOrder,
  getEventsByDateFromLessons,
  groupLessonsByDate,
  getEventsByDate,
  getEventByLessonId,
  DATE_FORMAT,
} from "../../../constants/data";
import {
  getPositionedEvents,
  getFreeSlots,
  minutesToTime,
  filterEventsByCoaches,
} from "../../../utils/calendar";
import { useGetLessonsQuery } from "../../../services/lessons";
import { LessonType, LESSON_TYPES } from "../../../models";

import LessonCard from "../../base/LessonCard";
import EmptySlotCard from "../../base/EmptySlotCard";
import TimeBox from "../../base/TimeBox";
import CalendarControl from "./CalendarControl";
import CreateLessonForm from "../CreateLessonForm";
import DeleteLessonModal from "./DeleteLessonModal";

const cakraHeight = 10;

type FiltersParams = {
  coaches: COACHES[];
};

export const Calendar: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<
    string | undefined
  >();
  const [selectedLessonType, setSelectedLessonType] = useState<
    LessonType | undefined
  >();
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedFreeSlot, setSelectedFreeSlot] = useState<
    PositionedEvent | undefined
  >();

  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const cakraWidth = isLargerThan600 ? 40 : 20;

  // const { data: lessonsData } = useGetLessonsQuery("");

  // const groupedLessons = groupLessonsByDate(lessonsData || []);

  const [filters, setFilters] = useState<FiltersParams>({ coaches: [] });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const coaches = searchParams.getAll("coaches") as COACHES[];

    setFilters({ coaches });
  }, [searchParams]);

  const renderHeader = (header: string | Date) => (
    <Flex h={cakraHeight} alignItems="center" gap={2}>
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
    // const eventsByDate = getEventsByDateFromLessons(date, groupedLessons);
    const eventsByDate = getEventsByDate(date);
    const filteredEvents = filterEventsByCoaches(eventsByDate, filters.coaches);
    const positionedEvents = getPositionedEvents(
      filteredEvents,
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
      <VStack key={date.toDateString()} spacing={0}>
        {renderHeader(date)}
        <Box
          position="relative"
          w={cakraWidth}
          h={cakraHeight * timeData.length}
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
        orderedCoaches={positionedEvent.orderedCoaches}
        selectedCoaches={filters.coaches}
        onClick={() => setSelectedLessonId(positionedEvent.id)}
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

  const showFreeSlots = (
    lessonType: LESSON_TYPES,
    coaches: COACHES[],
    duration: number
  ): void => {
    const type = lessonTypesData
      .filter((lt) => lt.type === lessonType)
      .find((lt) =>
        coaches.every((coach) => lt.coaches.find((c) => c.name === coach))
      );

    if (type) {
      setSelectedLessonType(type);
      setSelectedDuration(duration);
      setSelectedFreeSlot(undefined);
    }
  };

  const submitCreateLesson = (label: string) => {
    if (!selectedFreeSlot || !selectedLessonType) {
      return;
    }

    if (selectedLessonType.coaches.length === 1) {
      const timeBounds: [number, number] = [
        selectedFreeSlot.startTime,
        selectedFreeSlot.endTime,
      ];

      updateCoachesOrder(
        selectedFreeSlot.date,
        selectedLessonType.coaches[0],
        timeBounds,
        selectedLessonType.type
      );
    }

    addLesson({
      id: nanoid(8),
      lessonType: selectedLessonType,
      participants: [],
      date: format(selectedFreeSlot.date, DATE_FORMAT),
      startTime: minutesToTime(selectedFreeSlot.startTime),
      endTime: minutesToTime(selectedFreeSlot.endTime),
      label,
    });

    cancelCreateLesson();
  };

  const cancelCreateLesson = () => {
    setSelectedLessonType(undefined);
    setSelectedDuration(0);
    setSelectedFreeSlot(undefined);
  };

  return (
    <Grid
      templateAreas={`"control"
                      "calendar"`}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      h="100dvh"
      overflowY="hidden"
      gap="1"
      color="blackAlpha.700"
    >
      <GridItem pl="2" area={"control"} boxShadow="md" overflow="hidden">
        <CalendarControl />
      </GridItem>

      <GridItem
        area={"calendar"}
        overflowX="scroll"
        h="100%"
        paddingBottom={50}
      >
        <HStack spacing={0} alignItems="flex-start" position="relative">
          <VStack spacing={0} position="sticky" zIndex={2}>
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
        event={getEventByLessonId(selectedLessonId)}
        isOpen={!!selectedLessonId}
        onCancel={() => setSelectedLessonId(undefined)}
      />
    </Grid>
  );
};

export default Calendar;
