import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { cancelledError, isCancelledError } from './cancellation';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
});

/**
 * Turn a possibly relative endpoint path into an absolute URL, so the raw-XHR
 * transfer endpoints resolve against the same base as `fetchBaseQuery`.
 */
export const resolveUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `${process.env.API_URL ?? ''}${url}`;

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // The request was cancelled before it ever left: skip the offline check and
  // the fetch, and report it as a cancellation rather than as a failure.
  if (api.signal.aborted) {
    return { error: cancelledError() as unknown as FetchBaseQueryError };
  }

  // Block outgoing requests while the device is offline. The `network` slice is
  // kept up to date by NetworkListener (see src/components/Network).
  const isConnected =
    (api.getState() as { network?: { isConnected: boolean } }).network
      ?.isConnected ?? true;

  if (!isConnected) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: 'No internet connection',
      } as FetchBaseQueryError,
    };
  }

  // `fetchBaseQuery` forwards `api.signal` to `fetch`, so aborting the request
  // promise really does tear down the connection. Normalise the resulting error
  // so callers only ever have to check `isCancelledError`.
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && isCancelledError(result.error)) {
    return { error: cancelledError() as unknown as FetchBaseQueryError };
  }

  if (result.error && result.error.status === 401) {
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
