import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Calendar from "../components/shared/Calendar";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <Calendar />,
  },
]);

export default mainRouter;
