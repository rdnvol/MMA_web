import React from "react";
import { HStack, VStack } from "@chakra-ui/react";
import {
  DATE_FORMAT,
  PositionedEvent,
  Event,
  timeData,
} from "../../../../constants/data";
import TimeBox from "../../../base/TimeBox";
import { format } from "date-fns";
import { Lesson, LessonType } from "../../../../models";
import CalendarHeader from "./CalendarHeader";
import CalendarColumn from "./CalendarColumn";
import { useTranslation } from "react-i18next";

export type CalendarTableProps = {
  dateRange: Date[];
  lessonsData: Record<string, Lesson[]>;
  selectedLessonType?: LessonType;
  selectedDuration?: number;
  selectedFreeSlot?: PositionedEvent;
  onSelectFreeSlot: (positionedEvent: PositionedEvent) => void;
  onSelectLesson: (event: Event) => void;
};

export const CalendarTable: React.FC<CalendarTableProps> = ({
  dateRange,
  lessonsData,
  selectedLessonType,
  selectedDuration,
  selectedFreeSlot,
  onSelectFreeSlot,
  onSelectLesson,
}) => {
  const { t } = useTranslation("common");
  return (
    <HStack spacing={0} alignItems="flex-start" position="relative">
      <VStack spacing={0} position="sticky" zIndex={2} left={0} bg="white">
        <CalendarHeader header={t<string>("Time")} />
        {timeData.map((time) => (
          <TimeBox key={time}>{time}</TimeBox>
        ))}
      </VStack>
      {dateRange.map((date) => (
        <CalendarColumn
          key={format(date, DATE_FORMAT)}
          date={date}
          lessonsData={lessonsData}
          selectedLessonType={selectedLessonType}
          selectedDuration={selectedDuration}
          selectedFreeSlot={selectedFreeSlot}
          onSelectFreeSlot={onSelectFreeSlot}
          onSelectLesson={onSelectLesson}
        />
      ))}
    </HStack>
  );
};

export default React.memo(CalendarTable);
