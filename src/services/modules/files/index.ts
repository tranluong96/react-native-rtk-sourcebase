import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { api, resolveUrl } from '../../api';
import { isCancelledError } from '../../cancellation';
import { xhrRequest } from '../../xhr';
import {
  transferCancelled,
  transferFailed,
  transferProgress,
  transferStarted,
  transferSucceeded,
} from '@/store/transfer';

export type UploadFileArgs = {
  /** Caller-owned id used to read progress back out of the `transfer` slice. */
  id: string;
  url: string;
  file: { uri: string; name: string; type: string };
  /** Extra multipart fields sent alongside the file. */
  fields?: Record<string, string>;
  headers?: Record<string, string>;
};

export type DownloadFileArgs = {
  id: string;
  url: string;
  headers?: Record<string, string>;
};

export type DownloadFileResult = {
  id: string;
  url: string;
  /** `blob:` URI usable as an `Image` source, or `null` if unsupported. */
  localUri: string | null;
  size: number;
  mimeType: string;
};

const toLocalUri = (blob: Blob): string | null => {
  try {
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

/**
 * Upload and download run through `queryFn` instead of the shared `baseQuery`
 * because they need XHR progress events. They still receive `baseQueryApi.signal`,
 * so `trigger(args).abort()` tears the transfer down mid-flight — which is the
 * whole point for a large file.
 */
export const fileApi = api.injectEndpoints({
  endpoints: build => ({
    uploadFile: build.mutation<unknown, UploadFileArgs>({
      queryFn: async ({ id, url, file, fields, headers }, { dispatch, signal }) => {
        dispatch(transferStarted({ id, kind: 'upload' }));

        const form = new FormData();
        form.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as unknown as Blob);
        Object.entries(fields ?? {}).forEach(([key, value]) =>
          form.append(key, value),
        );

        const result = await xhrRequest<unknown>({
          url: resolveUrl(url),
          method: 'POST',
          body: form,
          headers,
          signal,
          onUploadProgress: (loaded, total) =>
            dispatch(transferProgress({ id, loaded, total })),
        });

        if ('error' in result) {
          if (isCancelledError(result.error)) {
            dispatch(transferCancelled({ id }));
          } else {
            dispatch(transferFailed({ id, error: String(result.error.error) }));
          }
          return { error: result.error as unknown as FetchBaseQueryError };
        }

        dispatch(transferSucceeded({ id }));
        return { data: result.data };
      },
    }),

    downloadFile: build.mutation<DownloadFileResult, DownloadFileArgs>({
      queryFn: async ({ id, url, headers }, { dispatch, signal }) => {
        dispatch(transferStarted({ id, kind: 'download' }));

        const result = await xhrRequest<Blob>({
          url: resolveUrl(url),
          method: 'GET',
          responseType: 'blob',
          headers,
          signal,
          onDownloadProgress: (loaded, total) =>
            dispatch(transferProgress({ id, loaded, total })),
        });

        if ('error' in result) {
          if (isCancelledError(result.error)) {
            dispatch(transferCancelled({ id }));
          } else {
            dispatch(transferFailed({ id, error: String(result.error.error) }));
          }
          return { error: result.error as unknown as FetchBaseQueryError };
        }

        dispatch(transferSucceeded({ id }));
        return {
          data: {
            id,
            url,
            localUri: toLocalUri(result.data),
            size: result.data?.size ?? 0,
            mimeType: result.data?.type ?? '',
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadFileMutation, useDownloadFileMutation } = fileApi;
