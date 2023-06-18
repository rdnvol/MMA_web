import { Box, Card, VStack, Text, Flex } from "@chakra-ui/react";
import React from "react";

import { COACHES, Position } from "../../../constants/data";
import { LESSON_TYPES } from "../../../models";

const minHeight = 40;
const maxWidth = 160;

const colorsMap: Record<COACHES, string> = {
  [COACHES.Vika]: "green.300",
  [COACHES.Sasha]: "red.300",
  [COACHES.Empty]: "gray.300",
};

export type LessonCardProps = {
  label?: string;
  coaches: COACHES[];
  position: Position;
  lessonType?: LESSON_TYPES;
};

export const LessonCard: React.FC<LessonCardProps> = (
  props: LessonCardProps
) => {
  const height = props.position.h * 40;
  const width = props.position.w * maxWidth;
  const top = props.position.y * minHeight;
  const left = props.position.x * maxWidth;
  const colors =
    props.coaches.length && props.lessonType !== LESSON_TYPES.OTHER
      ? props.coaches.map((coach) => colorsMap[coach])
      : [colorsMap[COACHES.Empty]];

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
      <VStack h="100%" w="5px" spacing={0}>
        {colors.map((bgColor) => (
          <Box w="100%" h={`${100 / colors.length}%`} bgColor={bgColor} />
        ))}
      </VStack>
      <Flex direction="column" paddingX={1} overflow="hidden">
        <Text fontSize="xs" as="span" fontWeight="bold">
          {props.label || "."}
        </Text>
        <Text fontSize="xs" as="i">
          {props.lessonType}
        </Text>
      </Flex>
    </Card>
  );
};

export default LessonCard;
