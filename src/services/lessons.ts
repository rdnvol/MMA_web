// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DATE_FORMAT, TIME_FORMAT } from "../constants/data";
import type { Lesson } from "../models";
import config from "../config";
import { parseISO, format } from "date-fns";

// Define a service using a base URL and expected endpoints
export const lessonsApi = createApi({
  reducerPath: "lessonsApi",
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], string>({
      query: () => `lessons/`,
      transformResponse: (response: any) =>
        (response.data || []).slice(10, 12).map((lessonData: any) => {
          const { startDate, endDate, ...lesson } = lessonData;
          return {
            ...lesson,
            date: format(parseISO(startDate), DATE_FORMAT),
            startTime: format(parseISO(startDate), TIME_FORMAT),
            endTime: format(parseISO(endDate), TIME_FORMAT),
          };
        }),
      transformErrorResponse: (response: any) => response.error,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLessonsQuery } = lessonsApi;
