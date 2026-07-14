import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Everything RTK Query hands back from a lazy-query / mutation trigger, or from
 * `dispatch(endpoint.initiate(arg))`: a promise carrying its own `abort()`.
 */
export type AbortableRequest<T = any> = Promise<T> & {
  abort: () => void;
  unwrap?: () => Promise<any>;
};

/**
 * Track in-flight requests and abort the ones still running.
 *
 * Every tracked request is aborted when the component unmounts, so a screen
 * that goes away never keeps a socket open, never resolves into an unmounted
 * tree, and never spends bandwidth on a response nobody will read.
 *
 * `isPending` is reactive, so it can drive a spinner or a disabled Cancel button.
 *
 * @example
 * const { run, cancelAll, isPending } = useCancellableRequest();
 * const user = await run(fetchOne(id)).unwrap().catch(ignoreCancelled);
 */
export default function useCancellableRequest() {
  const pending = useRef(new Set<AbortableRequest>());
  const isMounted = useRef(true);
  const [pendingCount, setPendingCount] = useState(0);

  const sync = useCallback(() => {
    if (isMounted.current) {
      setPendingCount(pending.current.size);
    }
  }, []);

  const run = useCallback(
    <T extends AbortableRequest>(request: T): T => {
      pending.current.add(request);
      sync();

      const forget = () => {
        pending.current.delete(request);
        sync();
      };
      // The trigger promise itself settles rather than rejects, but guard both
      // paths so a rejection can never leave a stale entry behind.
      request.then(forget, forget);

      return request;
    },
    [sync],
  );

  const cancelAll = useCallback(() => {
    pending.current.forEach(request => {
      try {
        request.abort();
      } catch {
        // Already settled: nothing left to abort.
      }
    });
    pending.current.clear();
    sync();
  }, [sync]);

  const hasPending = useCallback(() => pending.current.size > 0, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      // Flip first: cancelAll must not try to set state on the way out.
      isMounted.current = false;
      cancelAll();
    };
  }, [cancelAll]);

  return {
    run,
    cancelAll,
    hasPending,
    isPending: pendingCount > 0,
    pendingCount,
  };
}
