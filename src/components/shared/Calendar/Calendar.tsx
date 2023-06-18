import React, { useState } from "react";
import { HStack, Box, StackDivider, VStack } from "@chakra-ui/react";

import {
  weekdays,
  timeData,
  events,
  PositionedEvent,
  dailyBounds,
  slotDuration,
  COACHES,
  lessonTypesData,
} from "../../../constants/data";
import { getPositionedEvents, getFreeSlots } from "../../../utils/calendar";
import CreateLessonForm from "../CreateLessonForm";
import LessonCard from "../../base/LessonCard";
import { LessonType, LESSON_TYPES } from "../../../models";

const cakraHeight = 10;
const cakraWidth = 40;

export const Calendar: React.FC = () => {
  const [selectedLessonType, setSelectedLessonType] =
    useState<LessonType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);

  const renderHeader = (header: string) => (
    <Box w="50px" h={cakraHeight}>
      {header}
    </Box>
  );

  const renderTime = (data: string = "") => (
    <Box key={data} w="50px" h={cakraHeight}>
      {data}
    </Box>
  );

  const renderEvent = (positionedEvent: PositionedEvent) => {
    return (
      <LessonCard
        position={positionedEvent.position}
        coaches={positionedEvent.coaches}
        lessonType={positionedEvent.lessonType}
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
    }
  };

  return (
    <HStack
      spacing="0px"
      divider={<StackDivider borderColor="gray.200" />}
      alignItems="flex-start"
    >
      <VStack spacing={0}>
        {renderHeader("Time")}
        {timeData.map(renderTime)}
      </VStack>
      {weekdays.map((dayOfWeek) => (
        <VStack key={dayOfWeek} spacing={0}>
          {renderHeader(dayOfWeek)}
          <Box
            position="relative"
            w={cakraWidth}
            h={cakraHeight * timeData.length}
          >
            {getPositionedEvents(
              events[dayOfWeek] || [],
              dailyBounds,
              slotDuration
            ).map((event) => renderEvent(event))}
            {selectedLessonType &&
              getFreeSlots(
                events[dayOfWeek] || [],
                dailyBounds,
                selectedDuration,
                (selectedLessonType.coaches || []).map(
                  (coach) => coach.name as COACHES
                )
              ).map((event) => renderEvent(event))}
          </Box>
        </VStack>
      ))}
      {<CreateLessonForm onShowFreeSlots={showFreeSlots} />}
    </HStack>
  );
};

export default Calendar;
