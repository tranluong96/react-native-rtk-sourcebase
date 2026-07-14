import { api } from '../../api';
import { Post } from '../../../models/post';

export const postApi = api.injectEndpoints({
  endpoints: build => ({
    addPost: build.mutation<Post, Omit<Post, "id">>({
      query: body => ({
        url: `/posts`,
        method: "POST",
        body
      })
    })
  }),
  overrideExisting: false,
});

export const { useAddPostMutation } = postApi;
