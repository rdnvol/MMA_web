// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { groupLessonsByDate } from "../constants/data";
import type { Lesson } from "../models";
import config from "../config";
import api from "../apiSingleton";

// Define a service using a base URL and expected endpoints
export const lessonsApi = createApi({
  reducerPath: "lessonsApi",
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    getLessons: builder.query<Record<string, Lesson[]>, string>({
      query: (searchParams) => `lessons?${searchParams}`,
      transformResponse: (response: any) => {
        const lessons: Lesson[] = response.data || [];
        const groupedLessons = groupLessonsByDate(lessons);

        return groupedLessons;
      },
      transformErrorResponse: (response: any) => response.error,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLessonsQuery } = lessonsApi;
export const createLesson = api.lessons.create.bind(api.lessons);
export const deleteLesson = api.lessons.delete.bind(api.lessons);
