import { Box, useMediaQuery, VStack } from "@chakra-ui/react";
import { isEqual } from "date-fns";
import React from "react";
import {
  dailyBounds,
  getEventsByDateFromLessons,
  PositionedEvent,
  Event,
  slotDuration,
  timeData,
} from "../../../../constants/data";
import { cellHeight, cellWidth } from "../../../../constants/table";
import { Lesson, LessonType } from "../../../../models";
import { getFreeSlots, getPositionedEvents } from "../../../../utils/calendar";
import EmptySlotCard from "../../../base/EmptySlotCard";
import LessonCard from "../../../base/LessonCard";
import TimeBox from "../../../base/TimeBox";
import CalendarHeader from "./CalendarHeader";

export type CalendarColumnProps = {
  date: Date;
  lessonsData: Record<string, Lesson[]>;
  selectedLessonType?: LessonType;
  selectedDuration?: number;
  selectedCoaches?: number[];
  selectedFreeSlot?: PositionedEvent;
  onSelectFreeSlot: (positionedEvent: PositionedEvent) => void;
  onSelectLesson: (event: Event) => void;
};

const CalendarColumn: React.FC<CalendarColumnProps> = ({
  date,
  lessonsData,
  selectedLessonType,
  selectedDuration,
  selectedFreeSlot,
  selectedCoaches,
  onSelectFreeSlot,
  onSelectLesson,
}) => {
  const eventsByDate = getEventsByDateFromLessons(date, lessonsData);
  const positionedEvents = getPositionedEvents(
    eventsByDate,
    dailyBounds,
    slotDuration
  );

  const freeSlots =
    selectedLessonType && selectedDuration
      ? getFreeSlots(
          eventsByDate,
          selectedLessonType,
          selectedDuration,
          date,
          dailyBounds
        )
      : [];

  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const width = isLargerThan600 ? cellWidth.md : cellWidth.sm;

  const renderLesson = (
    positionedEvent: PositionedEvent,
    selectedCoaches?: number[]
  ) => {
    return (
      <LessonCard
        key={positionedEvent.id}
        position={positionedEvent.position}
        coaches={positionedEvent.coaches}
        label={positionedEvent.label}
        lessonType={positionedEvent.lessonType}
        isFloating={positionedEvent.isFloating}
        coachOrder={positionedEvent.coachOrder}
        selectedCoaches={selectedCoaches}
        onClick={() => onSelectLesson(positionedEvent)}
      />
    );
  };

  const renderEmptySlot = (positionedEvent: PositionedEvent) => {
    return (
      <EmptySlotCard
        key={`${positionedEvent.startTime}`}
        position={positionedEvent.position}
        onClick={() => onSelectFreeSlot(positionedEvent)}
        isSelected={
          selectedFreeSlot &&
          isEqual(selectedFreeSlot?.date, positionedEvent.date) &&
          selectedFreeSlot?.startTime === positionedEvent.startTime
        }
      />
    );
  };

  return (
    <VStack key={date.toDateString()} spacing={0} position="relative">
      <CalendarHeader header={date} />
      <Box
        position="relative"
        w={`${width}px`}
        h={`${cellHeight * timeData.length}px`}
      >
        {timeData.map((time) => (
          <TimeBox key={time} />
        ))}

        {positionedEvents.map((event) => renderLesson(event, selectedCoaches))}
        {freeSlots.map(renderEmptySlot)}
      </Box>
    </VStack>
  );
};

export default React.memo(CalendarColumn);
