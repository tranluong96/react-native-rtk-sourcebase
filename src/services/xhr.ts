import { CancelledError, cancelledError } from './cancellation';

/**
 * `fetch` cannot report upload progress and cannot stream download progress in
 * React Native, so transfers go through XMLHttpRequest instead. Both are still
 * driven by the same `AbortSignal` RTK Query hands to a `queryFn`.
 */

export type XhrProgress = (loaded: number, total: number) => void;

export type XhrArgs = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: FormData | string | null;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  signal?: AbortSignal;
  onUploadProgress?: XhrProgress;
  onDownloadProgress?: XhrProgress;
  /** Milliseconds; `0` disables the timeout. */
  timeout?: number;
};

export type XhrError =
  | CancelledError
  | { status: number | 'FETCH_ERROR' | 'TIMEOUT_ERROR'; error: string };

export type XhrResult<T> = { data: T } | { error: XhrError };

/**
 * Promise-based XHR that resolves (never rejects) with an RTK-Query-shaped
 * result, reports upload/download progress, and aborts as soon as `signal`
 * fires — including when it was already aborted before we started.
 */
export const xhrRequest = <T = unknown>({
  url,
  method = 'GET',
  headers,
  body = null,
  responseType = 'json',
  signal,
  onUploadProgress,
  onDownloadProgress,
  timeout = 0,
}: XhrArgs): Promise<XhrResult<T>> =>
  new Promise(resolve => {
    if (signal?.aborted) {
      resolve({ error: cancelledError() });
      return;
    }

    const xhr = new XMLHttpRequest();
    let settled = false;

    const abortRequest = () => xhr.abort();

    const settle = (result: XhrResult<T>) => {
      if (settled) {
        return;
      }
      settled = true;
      signal?.removeEventListener('abort', abortRequest);
      resolve(result);
    };

    signal?.addEventListener('abort', abortRequest);

    xhr.open(method, url, true);
    xhr.responseType = responseType;

    if (timeout > 0) {
      xhr.timeout = timeout;
    }

    Object.entries(headers ?? {}).forEach(([key, value]) =>
      xhr.setRequestHeader(key, value),
    );

    if (onUploadProgress && xhr.upload) {
      xhr.upload.onprogress = event =>
        onUploadProgress(event.loaded, event.lengthComputable ? event.total : 0);
    }

    if (onDownloadProgress) {
      xhr.onprogress = event =>
        onDownloadProgress(
          event.loaded,
          event.lengthComputable ? event.total : 0,
        );
    }

    xhr.onabort = () => settle({ error: cancelledError() });

    xhr.ontimeout = () =>
      settle({ error: { status: 'TIMEOUT_ERROR', error: 'Request timed out' } });

    xhr.onerror = () =>
      settle({
        error: { status: 'FETCH_ERROR', error: 'Network request failed' },
      });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        settle({ data: xhr.response as T });
        return;
      }
      settle({
        error: {
          status: xhr.status,
          error: xhr.statusText || `Request failed with status ${xhr.status}`,
        },
      });
    };

    xhr.send(body as any);
  });
