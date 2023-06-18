import React from "react";
import { Box } from "@chakra-ui/react";
import { cellHeight } from "../../../constants/table";

export const TimeBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Box
    w="full"
    h={`${cellHeight}px`}
    borderColor="gray.200"
    borderBottomWidth={1}
    borderRightWidth={1}
    textAlign="right"
    p="1"
  >
    {children}
  </Box>
);

export default TimeBox;
