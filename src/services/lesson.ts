// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Lesson } from "../models";
import config from "../config";

// Define a service using a base URL and expected endpoints
export const lessonApi = createApi({
  reducerPath: "lessonApi",
  tagTypes: ["Lesson"],
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    getLesson: builder.query<Lesson, number>({
      query: (lessonId) => `lessons/${lessonId}`,
      // transformResponse: (response: any) => response.data,
      transformErrorResponse: (response: any) => response.error,
    }),

    updateLesson: builder.mutation<Lesson, Partial<Lesson>>({
      query: ({ id: lessonId, ...lesson }) => ({
        url: `lessons/${lessonId}`,
        method: "PUT",
        body: lesson,
      }),
      invalidatesTags: ["Lesson"],
      // transformResponse: (response: any) => response.data,
      transformErrorResponse: (response: any) => response.error,
    }),

    deleteLesson: builder.mutation<Lesson, number>({
      query: (lessonId) => ({
        url: `lessons/${lessonId}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["Lesson"],
      // transformResponse: (response: any) => response.data,
      transformErrorResponse: (response: any) => response.error,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetLessonQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
