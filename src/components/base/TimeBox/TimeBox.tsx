import React from "react";
import { Box } from "@chakra-ui/react";

const cakraHeight = 10;

export const TimeBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Box
    w="full"
    h={cakraHeight}
    borderColor="gray.200"
    borderTopWidth={1}
    borderRightWidth={1}
    textAlign="right"
    p="1"
  >
    {children}
  </Box>
);

export default TimeBox;
