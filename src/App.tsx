import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import mainRouter from "./routers/mainRouter";

export const App = () => (
  <ChakraProvider theme={theme}>
    <RouterProvider router={mainRouter} />
  </ChakraProvider>
);
