import { Box, Card, VStack, Text, Flex, useMediaQuery } from "@chakra-ui/react";
import React from "react";

import { COACHES, Position } from "../../../constants/data";
import { LESSON_TYPES } from "../../../models";

const minHeight = 40;

const colorsMap: Record<COACHES, string> = {
  [COACHES.Vika]: "green.300",
  [COACHES.Sasha]: "red.300",
  [COACHES.Empty]: "gray.300",
};

export type LessonCardProps = {
  label?: string;
  coaches: COACHES[];
  orderedCoaches?: COACHES[];
  position: Position;
  lessonType?: LESSON_TYPES;
  isFloating?: boolean;
  selectedCoaches?: COACHES[];
};

export const LessonCard: React.FC<LessonCardProps> = (
  props: LessonCardProps
) => {
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const maxWidth = isLargerThan600 ? 160 : 80;

  const height = props.position.h * 40;
  const width = props.position.w * maxWidth;
  const top = props.position.y * minHeight;
  const left = props.position.x * maxWidth;

  const getColors = () => {
    const coaches = !!props.orderedCoaches?.length
      ? props.orderedCoaches
      : props.coaches;

    let colors = [colorsMap[COACHES.Empty]];

    if (coaches.length && props.lessonType !== LESSON_TYPES.OTHER) {
      colors = coaches.map((coach) => {
        const isSelected =
          !props.selectedCoaches?.length ||
          props.selectedCoaches.find((c) => c === coach);

        return isSelected ? colorsMap[coach] : colorsMap[COACHES.Empty];
      });
    }

    if (props.isFloating) {
      colors.push(...colors);
      colors.push(...colors);
    }

    return colors;
  };

  const colors = getColors();

  const label =
    width >= maxWidth / 2
      ? props.label
      : (props.label || "")
          .split(" ")
          .map((l) => l.substring(0, 1))
          .join(" ");

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
      <VStack h="100%" w="5px" minW="5px" spacing={0}>
        {colors.map((bgColor, index) => (
          <Box
            key={index}
            w="100%"
            h={`${100 / colors.length}%`}
            bgColor={bgColor}
          />
        ))}
      </VStack>
      <Flex direction="column" paddingX={1} overflow="hidden">
        <Text fontSize="xs" as="span" fontWeight="bold" noOfLines={3}>
          {label}
        </Text>
        <Text fontSize="xs" as="i" noOfLines={1}>
          {props.lessonType}
        </Text>
      </Flex>
    </Card>
  );
};

export default LessonCard;
