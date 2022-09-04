// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchPostsResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId);
            if (post) {
              post.reactions[reaction]++;
            }
          }),
        );

        const patchPostResult = dispatch(
          apiSlice.util.updateQueryData('getPost', postId, (draft) => {
            if (draft) {
              draft.reactions[reaction]++;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchPostsResult.undo();
          patchPostResult.undo();
        }
      },
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useAddReactionMutation } = apiSlice;
