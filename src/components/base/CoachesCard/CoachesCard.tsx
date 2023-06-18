import { Box, Card, CardProps, VStack } from "@chakra-ui/react";
import React from "react";
import { COACHES } from "../../../constants/data";
import { Coach, LessonType, LESSON_TYPES } from "../../../models";
import arrayToMap from "../../../utils/arrayToMap";

const colorsMap: Record<COACHES, string> = {
  [COACHES.Vika]: "green.300",
  [COACHES.Sasha]: "red.300",
  [COACHES.Empty]: "gray.300",
};

export type CoachesCardProps = CardProps & {
  coaches: Coach[];
  coachOrder?: number[];
  selectedCoaches?: number[];
  lessonType?: LessonType;
  isFloating?: boolean;
};

export const CoachesCard: React.FC<CoachesCardProps> = ({
  coaches: coachesProps,
  coachOrder,
  selectedCoaches,
  lessonType,
  isFloating,
  ...props
}) => {
  const getColors = () => {
    const coachesMap = arrayToMap<Coach>(coachesProps);

    const coaches: Coach[] = !!coachOrder?.length
      ? coachOrder.map((cId) => coachesMap[cId])
      : coachesProps;

    let colors = [colorsMap[COACHES.Empty]];

    if (coaches.length && lessonType?.type !== LESSON_TYPES.Other) {
      colors = coaches.map((coach) => {
        const isSelected =
          !selectedCoaches?.length ||
          selectedCoaches.find((c) => c === coach.id);

        return isSelected
          ? colorsMap[coach.name as COACHES]
          : colorsMap[COACHES.Empty];
      });
    }

    if (isFloating) {
      colors.push(...colors);
      colors.push(...colors);
    }

    return colors;
  };

  const colors = getColors();

  return (
    <Card direction="row" overflow="hidden" variant="outline" {...props}>
      <VStack w="5px" minW="5px" maxW="5px" spacing={0} flexGrow={1}>
        {colors.map((bgColor, index) => (
          <Box
            key={index}
            w="100%"
            h={`${100 / colors.length}%`}
            bgColor={bgColor}
          />
        ))}
      </VStack>
      {props.children}
    </Card>
  );
};
