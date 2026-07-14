import { act, renderHook } from '@testing-library/react-native';

import useCancellableRequest, { AbortableRequest } from '../useCancellableRequest';
import { isCancelledError } from '@/services/cancellation';

/** Stand-in for an RTK Query trigger result: a promise that carries `abort()`. */
const makeRequest = () => {
  let reject!: (reason?: unknown) => void;
  const promise = new Promise((_resolve, rejectFn) => {
    reject = rejectFn;
  }) as AbortableRequest;

  promise.abort = jest.fn(() => reject({ name: 'AbortError', message: 'Aborted' }));
  return promise;
};

describe('useCancellableRequest', () => {
  it('aborts in-flight requests on unmount', async () => {
    const { result, unmount } = renderHook(() => useCancellableRequest());

    const request = makeRequest();
    const settled = request.catch(error => error);
    act(() => {
      result.current.run(request);
    });

    expect(result.current.isPending).toBe(true);

    unmount();

    expect(request.abort).toHaveBeenCalledTimes(1);
    expect(isCancelledError(await settled)).toBe(true);
  });

  it('cancelAll aborts every tracked request and clears the pending state', async () => {
    const { result } = renderHook(() => useCancellableRequest());

    const first = makeRequest();
    const second = makeRequest();
    const settled = Promise.all([first.catch(e => e), second.catch(e => e)]);

    act(() => {
      result.current.run(first);
      result.current.run(second);
    });
    expect(result.current.pendingCount).toBe(2);

    await act(async () => {
      result.current.cancelAll();
      await settled;
    });

    expect(first.abort).toHaveBeenCalledTimes(1);
    expect(second.abort).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });

  it('stops tracking a request once it settles', async () => {
    const { result } = renderHook(() => useCancellableRequest());

    let resolve!: (value: unknown) => void;
    const request = new Promise(res => {
      resolve = res;
    }) as AbortableRequest;
    request.abort = jest.fn();

    act(() => {
      result.current.run(request);
    });
    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolve('done');
      await request;
    });

    expect(result.current.isPending).toBe(false);
    expect(request.abort).not.toHaveBeenCalled();
  });
});
