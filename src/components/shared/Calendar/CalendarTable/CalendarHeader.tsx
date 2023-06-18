import React from "react";
import { Circle, Flex } from "@chakra-ui/react";
import { cellHeight } from "../../../../constants/table";
import { format, isToday } from "date-fns";

export type CalendarHeaderProps = {
  header: string | Date;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ header }) => {
  return (
    <Flex
      h={`${cellHeight}px`}
      alignItems="center"
      gap={2}
      position="sticky"
      top={0}
      bg="white"
      zIndex={2}
      w="full"
      justifyContent="center"
      borderColor="gray.200"
      borderBottomWidth={1}
    >
      {typeof header === "string" ? (
        header
      ) : (
        <>
          {format(header, "E")}
          <Circle
            size="28px"
            bg={isToday(header) ? "orange.600" : ""}
            color={isToday(header) ? "white" : ""}
          >
            {format(header, "dd")}
          </Circle>
        </>
      )}
    </Flex>
  );
};

export default React.memo(CalendarHeader);
