import { Box, Card, VStack, Text, Flex, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

import { COACHES, Position } from "../../../constants/data";
import { cellHeight, cellWidth } from "../../../constants/table";
import { Coach, LessonType, LESSON_TYPES } from "../../../models";
import arrayToMap from "../../../utils/arrayToMap";

const colorsMap: Record<COACHES, string> = {
  [COACHES.Vika]: "green.300",
  [COACHES.Sasha]: "red.300",
  [COACHES.Empty]: "gray.300",
};

export type LessonCardProps = {
  label?: string;
  coaches: Coach[];
  coachOrder?: Coach[];
  position: Position;
  lessonType?: LessonType;
  isFloating?: boolean;
  selectedCoaches?: number[];
  onClick?: () => void;
};

export const LessonCard: React.FC<LessonCardProps> = (
  props: LessonCardProps
) => {
  const { t } = useTranslation("common");
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const maxWidth = isLargerThan600 ? cellWidth.md : cellWidth.sm;

  const height = props.position.h * cellHeight;
  const width = props.position.w * maxWidth;
  const top = props.position.y * cellHeight;
  const left = props.position.x * maxWidth;

  const getColors = () => {
    const coachesMap = arrayToMap<Coach>(props.coaches);

    const coaches: Coach[] = !!props.coachOrder?.length
      ? props.coachOrder.map((c) => coachesMap[c.id])
      : props.coaches;

    let colors = [colorsMap[COACHES.Empty]];

    if (coaches.length && props.lessonType?.type !== LESSON_TYPES.Other) {
      colors = coaches.map((coach) => {
        const isSelected =
          !props.selectedCoaches?.length ||
          props.selectedCoaches.find((c) => c === coach.id);

        return isSelected
          ? colorsMap[coach.name as COACHES]
          : colorsMap[COACHES.Empty];
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
      onClick={props.onClick}
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
          {props.lessonType ? t(`lessonType:${props.lessonType.type}`) : ""}
        </Text>
      </Flex>
    </Card>
  );
};

export default LessonCard;
