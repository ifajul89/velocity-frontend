import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Cars"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://velocity-car-shop-backend.vercel.app/api",
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
