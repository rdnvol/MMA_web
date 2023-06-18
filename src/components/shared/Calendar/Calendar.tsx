import React, { useState } from "react";
import { nanoid } from "nanoid";
import {
  HStack,
  Box,
  StackDivider,
  VStack,
  Circle,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";

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
} from "../../../constants/data";
import {
  getPositionedEvents,
  getFreeSlots,
  minutesToTime,
  filterEventsByCoaches,
} from "../../../utils/calendar";
import CreateLessonForm from "../CreateLessonForm";
import LessonCard from "../../base/LessonCard";
import { LessonType, LESSON_TYPES } from "../../../models";
import { format, isToday } from "date-fns";
import EmptySlotCard from "../../base/EmptySlotCard";
import CalendarFilter from "./CalendarFilter";
import { useGetLessonsQuery } from "../../../services/lessons";

const cakraHeight = 10;
const cakraWidth = 40;

type FiltersParams = {
  coaches: COACHES[];
};

export const Calendar: React.FC = () => {
  const [selectedLessonType, setSelectedLessonType] = useState<
    LessonType | undefined
  >();
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedFreeSlot, setSelectedFreeSlot] = useState<
    PositionedEvent | undefined
  >();

  // const { data: lessonsData } = useGetLessonsQuery("");

  // const groupedLessons = groupLessonsByDate(lessonsData || []);

  const [filters, setFilters] = useState<FiltersParams>({ coaches: [] });

  const search = (searchFilters: { coaches: string[] }) => {
    setFilters({
      coaches: searchFilters.coaches as COACHES[],
    });
  };

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

  const renderTime = (time: string = "") => (
    <Box key={time} w="50px" h={cakraHeight}>
      {time}
    </Box>
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
      date: format(selectedFreeSlot.date, "yyyy-MM-dd"),
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
      templateAreas={`"nav calendar form"`}
      gridTemplateRows={"1fr"}
      gridTemplateColumns={"150px 1fr 300px"}
      h="100vh"
      overflowY="hidden"
      gap="1"
      color="blackAlpha.700"
    >
      <GridItem pl="2" area={"nav"} boxShadow="md">
        <CalendarFilter onSearch={search} />
      </GridItem>
      <GridItem pl="2" area={"calendar"} overflow="scroll" h="100%">
        <HStack
          spacing={0}
          divider={<StackDivider borderColor="gray.200" />}
          alignItems="flex-start"
        >
          <VStack spacing={0} divider={<StackDivider borderColor="gray.200" />}>
            {renderHeader("Time")}
            {timeData.map(renderTime)}
          </VStack>
          {currentWeek.map(renderDateColumn)}
        </HStack>
      </GridItem>
      <GridItem pl="2" area={"form"} boxShadow="md">
        <CreateLessonForm
          selectedFreeSlot={selectedFreeSlot}
          onShowFreeSlots={showFreeSlots}
          onSubmit={submitCreateLesson}
          onCancel={cancelCreateLesson}
        />
      </GridItem>
    </Grid>
  );
};

export default Calendar;
