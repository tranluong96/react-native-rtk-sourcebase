import { useSelector } from 'react-redux';
import { NetworkState } from '../store/network';

/**
 * Read the current connectivity status from the redux store.
 * The value is kept up to date by NetworkListener (see src/components/Network).
 *
 * @example
 * const { isConnected } = useNetwork();
 * if (!isConnected) return <Offline />;
 */
export default function useNetwork() {
  const isConnected = useSelector(
    (state: { network: NetworkState }) => state.network.isConnected,
  );

  return { isConnected };
}
