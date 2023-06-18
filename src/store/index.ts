import { configureStore } from "@reduxjs/toolkit";

import { coachesApi } from "../services/coaches";
import { lessonTypesApi } from "../services/lessonTypes";
import { lessonsApi } from "../services/lessons";

export const store = configureStore({
  reducer: {
    [coachesApi.reducerPath]: coachesApi.reducer,
    [lessonTypesApi.reducerPath]: lessonTypesApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      coachesApi.middleware,
      lessonTypesApi.middleware,
      lessonsApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
