import { Box, Card, VStack, Text } from "@chakra-ui/react";
import React from "react";

import { COACHES, Position } from "../../../constants/data";
import { LESSON_TYPES, TYPE_COLOR_MAP } from "../../../models";

const minHeight = 40;
const maxWidth = 160;

const colorsMap: Record<COACHES, string> = {
  [COACHES.Vika]: "green.200",
  [COACHES.Sasha]: "red.200",
  [COACHES.Empty]: "gray.200",
};

export type LessonCardProps = {
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
  const colors = props.coaches.length
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
      // bgColor={props.lessonType ? TYPE_COLOR_MAP[props.lessonType] : "gray.50"}
    >
      <VStack h="100%" w="5px" spacing={0}>
        {colors.map((bgColor) => (
          <Box w="100%" h={`${100 / colors.length}%`} bgColor={bgColor} />
        ))}
      </VStack>
      <VStack>
        <Text fontSize="xs" as="abbr">
          {props.coaches.join(", ")}
        </Text>
      </VStack>
    </Card>
  );
};

export default LessonCard;
