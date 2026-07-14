import { isCancelledError } from '@/services/cancellation';

/**
 * Build the message to show the user for a failed request.
 *
 * Returns `null` when there is nothing to show — which is the case for a
 * cancelled request: the user asked for it, so surfacing an error would be
 * reporting their own action back at them as a failure.
 *
 * @example
 * const message = getApiErrorMessage(error);
 * if (message) Alert.alert(message);
 */
export const getApiErrorMessage = (error: unknown): string | null => {
  if (!error || isCancelledError(error)) {
    return null;
  }

  if (typeof error === 'string') {
    return error;
  }

  const candidate = error as Record<string, any>;

  if (candidate.status === 'FETCH_ERROR') {
    return String(candidate.error ?? 'Network request failed');
  }

  if (candidate.status === 'TIMEOUT_ERROR') {
    return String(candidate.error ?? 'Request timed out');
  }

  const serverMessage = candidate.data?.message ?? candidate.data?.error;
  if (typeof serverMessage === 'string') {
    return serverMessage;
  }

  if (typeof candidate.message === 'string') {
    return candidate.message;
  }

  if (typeof candidate.error === 'string') {
    return candidate.error;
  }

  return 'Something went wrong';
};

/** `true` when the failure deserves to be shown to the user. */
export const shouldReportError = (error: unknown) =>
  getApiErrorMessage(error) !== null;
