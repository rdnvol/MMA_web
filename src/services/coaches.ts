// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coach } from "../models";
import config from "../config";

// Define a service using a base URL and expected endpoints
export const coachesApi = createApi({
  reducerPath: "coachesApi",
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    getCoaches: builder.query<Coach[], string>({
      query: () => `coaches/`,
      transformResponse: (response: any) => response.data,
      transformErrorResponse: (response: any) => response.error,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCoachesQuery } = coachesApi;
