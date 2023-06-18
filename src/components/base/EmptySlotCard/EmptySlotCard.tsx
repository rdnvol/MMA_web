import { Card, Skeleton, useMediaQuery } from "@chakra-ui/react";
import React from "react";

import { Position } from "../../../constants/data";
import { cellHeight, cellWidth } from "../../../constants/table";

export type EmptySlotCardProps = {
  position: Position;
  onClick: () => void;
  isSelected?: boolean;
};

export const EmptySlotCard: React.FC<EmptySlotCardProps> = (
  props: EmptySlotCardProps
) => {
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const maxWidth = isLargerThan600 ? cellWidth.md : cellWidth.sm;

  const height = props.position.h * cellHeight;
  const width = props.position.w * maxWidth;
  const top = props.position.y * cellHeight;
  const left = props.position.x * maxWidth;

  return (
    <Card
      position="absolute"
      top={`${top}px`}
      left={`${left}px`}
      w={`${width}px`}
      h={`${height}px`}
      direction="row"
      overflow="hidden"
      variant={"filled"}
      _hover={{
        bgColor: "orange.400",
        borderRadius: 8,
        zIndex: 2,
      }}
      bgColor={"orange.100"}
      onClick={props.onClick}
      borderRadius={0}
      opacity={0.5}
    >
      {props.isSelected && (
        <Skeleton
          w={`${width}px`}
          h={`${height}px`}
          endColor="orange.100"
          startColor="orange.400"
          borderRadius={8}
          zIndex={3}
        />
      )}
    </Card>
  );
};

export default EmptySlotCard;
