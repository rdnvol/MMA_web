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
  getEventsByDate,
  PositionedEvent,
  dailyBounds,
  slotDuration,
  COACHES,
  lessonTypesData,
  addLesson,
  updateCoachesOrder,
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
import CheckboxGroup from "../../base/CheckboxGroup/CheckboxGroup";

const cakraHeight = 10;
const cakraWidth = 40;

export const Calendar: React.FC = () => {
  const [selectedLessonType, setSelectedLessonType] = useState<
    LessonType | undefined
  >();
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedFreeSlot, setSelectedFreeSlot] = useState<
    PositionedEvent | undefined
  >();

  const [selectedCoaches, setSelectedCoaches] = useState<COACHES[]>([]);

  const changeSelectedCoaches = (value: string[]) => {
    setSelectedCoaches(value as COACHES[]);
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

  const renderTime = (data: string = "") => (
    <Box key={data} w="50px" h={cakraHeight}>
      {data}
    </Box>
  );

  const renderDateColumn = (date: Date) => {
    const eventsByDate = getEventsByDate(date);
    const filteredEvents = filterEventsByCoaches(eventsByDate, selectedCoaches);
    const positionedEvents = getPositionedEvents(
      filteredEvents,
      dailyBounds,
      slotDuration
    );
    const freeSlots =
      selectedLessonType && date.getDate() === 20
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
        position={positionedEvent.position}
        coaches={positionedEvent.coaches}
        label={positionedEvent.label}
        lessonType={positionedEvent.lessonType}
        isFloating={positionedEvent.isFloating}
        orderedCoaches={positionedEvent.orderedCoaches}
        selectedCoaches={selectedCoaches}
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
      <GridItem pl="2" area={"nav"}>
        <CheckboxGroup
          options={[
            { value: COACHES.Sasha, colorScheme: "red" },
            { value: COACHES.Vika, colorScheme: "green" },
          ]}
          value={selectedCoaches}
          onChange={changeSelectedCoaches}
        />
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
      <GridItem pl="2" area={"form"}>
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
