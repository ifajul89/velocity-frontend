import { baseApi } from "@/redux/api/baseApi";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postCar: builder.mutation({
      query: (carInfo) => ({
        url: "/cars",
        method: "POST",
        body: carInfo,
      }),
    }),
    getCars: builder.query({
      query: () => ({
        url: "/cars",
        method: "GET",
      }),
    }),
  }),
});

export const { usePostCarMutation, useGetCarsQuery } = carApi;
