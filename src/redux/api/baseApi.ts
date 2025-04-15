import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Cars"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
    prepareHeaders: (Headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        Headers.set("authorization", token);
      }
      return Headers;
    },
  }),
  endpoints: () => ({}),
});
