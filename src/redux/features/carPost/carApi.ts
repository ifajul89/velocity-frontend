import { baseApi } from "@/redux/api/baseApi";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postCar: builder.mutation({
      query: (carInfo) => ({
        url: "/cars",
        method: "POST",
        body: carInfo,
      }),
      invalidatesTags: [{ type: "Cars", id: "LIST" }],
    }),
    getCars: builder.query({
      query: () => ({
        url: "/cars",
        method: "GET",
      }),
      providesTags: [{ type: "Cars", id: "LIST" }],
    }),
    updateCar: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cars/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Cars", id: "LIST" }],
    }),
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Cars", id: "LIST" }],
    }),
  }),
});

export const { 
  usePostCarMutation, 
  useGetCarsQuery, 
  useUpdateCarMutation,
  useDeleteCarMutation 
} = carApi;
