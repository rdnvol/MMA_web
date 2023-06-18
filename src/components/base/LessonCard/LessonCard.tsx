import { Text, Flex, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Position } from "../../../constants/data";
import { cellHeight, cellWidth } from "../../../constants/table";
import { Coach, LessonType } from "../../../models";
import { CoachesCard } from "../CoachesCard/CoachesCard";

export type LessonCardProps = {
  label?: string;
  coaches: Coach[];
  coachOrder?: number[];
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

  const label =
    width >= maxWidth / 2
      ? props.label
      : (props.label || "")
          .split(" ")
          .map((l) => l.substring(0, 1))
          .join(" ");

  return (
    <CoachesCard
      position="absolute"
      top={`${top}px`}
      left={`${left}px`}
      w={`${width}px`}
      h={`${height}px`}
      onClick={props.onClick}
      coaches={props.coaches}
      coachOrder={props.coachOrder}
      selectedCoaches={props.selectedCoaches}
      lessonType={props.lessonType}
      isFloating={props.isFloating}
    >
      <Flex direction="column" paddingX={1} overflow="hidden">
        <Text fontSize="xs" as="span" fontWeight="bold" noOfLines={3}>
          {label}
        </Text>
        <Text fontSize="xs" as="i" noOfLines={1}>
          {props.lessonType ? t(`lessonType:${props.lessonType.type}`) : ""}
        </Text>
      </Flex>
    </CoachesCard>
  );
};

export default LessonCard;
