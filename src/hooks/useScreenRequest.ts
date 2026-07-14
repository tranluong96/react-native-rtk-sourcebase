import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import useCancellableRequest from './useCancellableRequest';

/**
 * `useCancellableRequest` for screens inside a navigator.
 *
 * On top of aborting on unmount, it aborts whatever is still in flight when the
 * screen loses focus. Bottom-tab screens stay mounted after you switch away, so
 * without this a half-finished fetch on the Notify tab keeps downloading its
 * response while the user is already reading the Profile tab — the most wasteful
 * request is the one whose result nobody will look at.
 *
 * Must be called from a screen rendered by a navigator. Anywhere else, use
 * `useCancellableRequest`.
 *
 * @example
 * const { run } = useScreenRequest();
 * const user = await run(fetchOne(id)).unwrap().catch(ignoreCancelled);
 */
export default function useScreenRequest() {
  const { run, cancelAll, hasPending, isPending, pendingCount } =
    useCancellableRequest();

  useFocusEffect(
    useCallback(() => {
      return () => cancelAll();
    }, [cancelAll]),
  );

  return { run, cancelAll, hasPending, isPending, pendingCount };
}
