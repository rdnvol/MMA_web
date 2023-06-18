import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Calendar from "./components/shared/Calendar";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Calendar />
  </ChakraProvider>
);
