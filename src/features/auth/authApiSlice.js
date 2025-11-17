import { apiSlice } from '../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: { ...userData },
      }),
    }),
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: '/users/profile',
        method: 'PUT',
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUpdateProfileMutation } = authApiSlice;
