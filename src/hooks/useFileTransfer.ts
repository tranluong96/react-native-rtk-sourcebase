import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { isCancelledError } from '@/services/cancellation';
import {
  DownloadFileArgs,
  DownloadFileResult,
  UploadFileArgs,
  useDownloadFileMutation,
  useUploadFileMutation,
} from '@/services/modules/files';
import { selectTransfer } from '@/store/transfer';
import { getApiErrorMessage } from '@/utils/functions/api_error';
import useCancellableRequest from './useCancellableRequest';

/**
 * The outcome of a transfer, with cancellation split out from failure so the
 * caller never has to decide whether an "error" is worth showing.
 */
export type TransferOutcome<T> =
  | { status: 'success'; data: T }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

/**
 * Drive one upload or download: start it, watch its progress, cancel it.
 *
 * The transfer is aborted on unmount, and `cancel()` aborts it on demand. Both
 * paths come back as `{ status: 'cancelled' }` rather than as an error.
 *
 * @example
 * const { upload, cancel, progress, isRunning } = useFileTransfer('avatar');
 * const result = await upload({ url: '/upload', file });
 * if (result.status === 'error') Alert.alert(result.message);
 */
export default function useFileTransfer(id: string) {
  const { run, cancelAll, isPending } = useCancellableRequest();
  const [uploadFile] = useUploadFileMutation();
  const [downloadFile] = useDownloadFileMutation();
  const transfer = useSelector(selectTransfer(id));

  const settle = useCallback(
    async <T>(request: Promise<T>): Promise<TransferOutcome<T>> => {
      try {
        return { status: 'success', data: await request };
      } catch (error) {
        if (isCancelledError(error)) {
          return { status: 'cancelled' };
        }
        return {
          status: 'error',
          message: getApiErrorMessage(error) ?? 'Transfer failed',
        };
      }
    },
    [],
  );

  const upload = useCallback(
    (args: Omit<UploadFileArgs, 'id'>) =>
      settle(run(uploadFile({ id, ...args })).unwrap()),
    [id, run, settle, uploadFile],
  );

  const download = useCallback(
    (args: Omit<DownloadFileArgs, 'id'>): Promise<TransferOutcome<DownloadFileResult>> =>
      settle(run(downloadFile({ id, ...args })).unwrap()),
    [id, run, settle, downloadFile],
  );

  return {
    upload,
    download,
    cancel: cancelAll,
    isRunning: transfer?.status === 'running' || isPending,
    progress: transfer?.progress ?? 0,
    status: transfer?.status ?? 'idle',
    loaded: transfer?.loaded ?? 0,
    total: transfer?.total ?? 0,
    error: transfer?.error ?? null,
  };
}
