import { baseApi } from "@/redux/api/baseApi";

// Create a specialized version of baseApi for user management
export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/user/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),
    adminUpdateUser: builder.mutation({
      query: ({ userId, userData }) => {
        console.log("Admin Update user API call with ID:", userId);

        // Validate userId before making the request
        if (!userId) {
          throw new Error("User ID is required for update");
        }

        // Return the full API configuration
        return {
          url: `user/admin-update/${userId}`,
          method: "PATCH",
          body: userData,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => {
        console.log("Deleting user with ID:", userId);

        // Validate userId before making the request
        if (!userId) {
          throw new Error("User ID is required for delete operation");
        }

        return {
          url: `/user/${userId}`,
          method: "DELETE",
          credentials: "include",
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useAdminUpdateUserMutation,
  useDeleteUserMutation,
} = userManagementApi;
