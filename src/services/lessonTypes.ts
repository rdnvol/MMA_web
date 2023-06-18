// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LessonType } from "../models";
import config from "../config";

// Define a service using a base URL and expected endpoints
export const lessonTypesApi = createApi({
  reducerPath: "lessonTypesApi",
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    getLessonTypes: builder.query<LessonType[], string>({
      query: () => `lesson-types/`,
      transformResponse: (response: any) => response.data,
      transformErrorResponse: (response: any) => response.error,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLessonTypesQuery } = lessonTypesApi;
