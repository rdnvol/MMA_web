import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  GridItem,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import Calendar from "./components/shared/Calendar";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={"50px 1fr 30px"}
      gridTemplateColumns={"150px 1fr"}
      h="200px"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      {/* <GridItem pl="2" bg="orange.300" area={"header"}> */}
      <GridItem pl="2" area={"header"}>
        Header
      </GridItem>
      {/* <GridItem pl="2" bg="pink.300" area={"nav"}> */}
      <GridItem pl="2" area={"nav"}>
        Nav
      </GridItem>
      {/* <GridItem pl="2" bg="green.300" area={"main"}> */}
      <GridItem pl="2" area={"main"}>
        <Calendar />
      </GridItem>
      {/* <GridItem pl="2" bg="blue.300" area={"footer"}> */}
      <GridItem pl="2" area={"footer"}>
        Footer
      </GridItem>
    </Grid>
  </ChakraProvider>
);
