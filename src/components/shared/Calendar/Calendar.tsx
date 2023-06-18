import React from "react";
import {
  HStack,
  Box,
  StackDivider,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Flex,
} from "@chakra-ui/react";

import {
  weekdays,
  timeData,
  events,
  Coaches,
  PositionedEvent,
  dailyBounds,
  slotDuration,
} from "../../../constants/data";
import { getPositionedEvents, getFreeSlots } from "../../../utils/calendar";

const colorsMap: Record<Coaches, string> = {
  [Coaches.Vika]: "green.200",
  [Coaches.Sasha]: "red.200",
  [Coaches.Empty]: "gray.200",
};

const minHeight = 40;
const maxWidth = 160;

export const Calendar: React.FC = () => {
  const renderHeader = (header: string) => (
    <Box w="50px" h="40px">
      {header}
    </Box>
  );

  const renderTime = (data: string = "") => (
    <Box key={data} w="50px" h={`${minHeight}px`}>
      {data}
    </Box>
  );

  const renderEvent = (positionedEvent: PositionedEvent) => {
    const height = positionedEvent.h * 40;
    const width = positionedEvent.w * maxWidth;
    const top = positionedEvent.y * minHeight;
    const left = positionedEvent.x * maxWidth;
    const bgColor = colorsMap[positionedEvent.coach];

    return (
      <Card
        position="absolute"
        top={`${top}px`}
        left={`${left}px`}
        w={`${width}px`}
        h={`${height}px`}
        direction="row"
        overflow="hidden"
        variant={"outline"}
      >
        <Box w="5px" bgColor={bgColor} />
        <VStack>
          <Text fontSize="xs" as="abbr">
            {positionedEvent.coach}
          </Text>
        </VStack>
      </Card>
    );
  };

  const renderAddSlotForm = () => {
    return (
      <VStack>
        <Box>Add slot form</Box>
      </VStack>
    );
  };

  return (
    <HStack spacing="0px" divider={<StackDivider borderColor="gray.200" />}>
      <VStack spacing={0}>
        {renderHeader("Time")}
        {timeData.map(renderTime)}
      </VStack>
      {weekdays.map((dayOfWeek) => (
        <VStack key={dayOfWeek} spacing={0}>
          {renderHeader(dayOfWeek)}
          <Box
            position="relative"
            w={`${maxWidth}px`}
            h={`${minHeight * timeData.length}px`}
          >
            {getPositionedEvents(
              events[dayOfWeek] || [],
              dailyBounds,
              slotDuration
            ).map((event) => renderEvent(event))}
            {getFreeSlots(
              events[dayOfWeek] || [],
              dailyBounds,
              slotDuration
            ).map((event) => renderEvent(event))}
          </Box>
        </VStack>
      ))}
      {renderAddSlotForm()}
    </HStack>
  );
};

export default Calendar;
