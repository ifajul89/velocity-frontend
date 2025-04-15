import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin-specific user update
    updateUser: builder.mutation({
      query: ({ id, userData }) => {
        console.log("Admin updating user with ID:", id, "Data:", userData);
        return {
          url: `user/admin-update/${id}`,
          method: "PATCH",
          body: userData,
        };
      },
      transformResponse: (response) => {
        console.log("Update user response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Update user error:", response);
        return response;
      },
      invalidatesTags: ["User"],
    }),
    // Regular user update (for updating own profile)
    updateCurrentUser: builder.mutation({
      query: ({ id, userData }) => {
        console.log("User updating own profile with ID:", id, "Data:", userData);
        return {
          url: `user/update/${id}`,
          method: "PATCH",
          body: userData,
        };
      },
      transformResponse: (response) => {
        console.log("Update user response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Update user error:", response);
        return response;
      },
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: ({ id, passwordData }) => {
        console.log("Changing password for user ID:", id, "Data:", passwordData);
        return {
          url: `/user/change-password/${id}`,
          method: "PATCH",
          body: passwordData,
        };
      },
      transformResponse: (response) => {
        console.log("Change password response:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Change password error:", response);
        return response;
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useUpdateUserMutation, 
  useUpdateCurrentUserMutation, 
  useChangePasswordMutation 
} = userApi; 