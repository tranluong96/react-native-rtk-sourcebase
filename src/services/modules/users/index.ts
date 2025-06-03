import { url } from 'inspector';
import { api } from '../../api';
import { User } from '../../../models/user.ds';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    fetchOne: build.query<User, string>({
      query: id => `/users/${id}`,
    }),

  }),
  overrideExisting: false,
});

export const { useLazyFetchOneQuery } = userApi;
