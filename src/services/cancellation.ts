/**
 * Cancellation primitives shared by every request layer (RTK Query, raw XHR).
 *
 * React Native has no axios CancelToken: the platform primitive is
 * `AbortController` / `AbortSignal`, which RTK Query already threads into every
 * `baseQuery` / `queryFn` through `baseQueryApi.signal`.
 *
 * The only thing missing is a *single* way to recognise "this failed because
 * somebody cancelled it", because the shape differs per layer:
 *
 *  - `trigger(arg).abort()`  -> `{ name: 'AbortError', message: 'Aborted' }`
 *  - a skipped/duplicate run -> `{ name: 'ConditionError' }`
 *  - `fetchBaseQuery`        -> `{ status: 'FETCH_ERROR', error: 'AbortError: Aborted' }`
 *  - our own `queryFn`       -> `{ status: 'CANCELLED' }`
 *
 * `isCancelledError` normalises all of them so the UI can stay silent.
 */

export const CANCELLED_STATUS = 'CANCELLED' as const;

export type CancelledError = {
  status: typeof CANCELLED_STATUS;
  error: string;
};

export const cancelledError = (
  reason = 'Request cancelled by user',
): CancelledError => ({
  status: CANCELLED_STATUS,
  error: reason,
});

const ABORT_ERROR_NAMES = ['AbortError', 'ConditionError'];

/**
 * True when the failure came from an abort, not from the network or the server.
 *
 * Cancellation is a user intention, never an error to report: callers use this
 * to skip alerts, toasts, retries and error logging.
 */
export const isCancelledError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }

  if (typeof error === 'string') {
    return /abort|cancel/i.test(error);
  }

  if (typeof error !== 'object') {
    return false;
  }

  const candidate = error as Record<string, any>;

  if (candidate.status === CANCELLED_STATUS) {
    return true;
  }

  if (
    typeof candidate.name === 'string' &&
    ABORT_ERROR_NAMES.includes(candidate.name)
  ) {
    return true;
  }

  if (
    typeof candidate.message === 'string' &&
    /^abort(ed)?$/i.test(candidate.message)
  ) {
    return true;
  }

  if (candidate.meta?.aborted || candidate.meta?.condition) {
    return true;
  }

  if (
    candidate.status === 'FETCH_ERROR' &&
    typeof candidate.error === 'string' &&
    /abort/i.test(candidate.error)
  ) {
    return true;
  }

  return false;
};

/**
 * Swallow a rejection when it was a cancellation, rethrow otherwise.
 *
 * @example
 * await trigger(id).unwrap().catch(ignoreCancelled);
 */
export const ignoreCancelled = (error: unknown) => {
  if (isCancelledError(error)) {
    return undefined;
  }
  throw error;
};

export type CancelToken = {
  signal: AbortSignal;
  cancel: (reason?: string) => void;
  isCancelled: () => boolean;
};

/**
 * Standalone cancel token for code that does not go through RTK Query
 * (a raw `fetch`, a third-party SDK that accepts an `AbortSignal`, ...).
 */
export const createCancelToken = (): CancelToken => {
  const controller = new AbortController();

  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
    isCancelled: () => controller.signal.aborted,
  };
};
