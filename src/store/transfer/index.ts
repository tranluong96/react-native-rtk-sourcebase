import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransferKind = 'upload' | 'download';

export type TransferStatus =
  | 'idle'
  | 'running'
  | 'success'
  | 'error'
  | 'cancelled';

export type Transfer = {
  id: string;
  kind: TransferKind;
  /** 0..1, or `0` while the server has not announced a content length. */
  progress: number;
  loaded: number;
  total: number;
  status: TransferStatus;
  error: string | null;
};

export type TransferState = {
  items: Record<string, Transfer>;
};

const initialState: TransferState = { items: {} };

const emptyTransfer = (id: string, kind: TransferKind): Transfer => ({
  id,
  kind,
  progress: 0,
  loaded: 0,
  total: 0,
  status: 'idle',
  error: null,
});

/**
 * Progress of every upload/download in flight.
 *
 * Progress lives in the store rather than in a callback passed as an endpoint
 * argument: RTK Query puts arguments into dispatched actions and into the cache
 * key, and a function is neither serializable nor comparable.
 */
const slice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    transferStarted: (
      state,
      { payload }: PayloadAction<{ id: string; kind: TransferKind }>,
    ) => {
      state.items[payload.id] = {
        ...emptyTransfer(payload.id, payload.kind),
        status: 'running',
      };
    },

    transferProgress: (
      state,
      { payload }: PayloadAction<{ id: string; loaded: number; total: number }>,
    ) => {
      const transfer = state.items[payload.id];
      if (!transfer) {
        return;
      }
      transfer.loaded = payload.loaded;
      transfer.total = payload.total;
      transfer.progress = payload.total > 0 ? payload.loaded / payload.total : 0;
    },

    transferSucceeded: (state, { payload }: PayloadAction<{ id: string }>) => {
      const transfer = state.items[payload.id];
      if (!transfer) {
        return;
      }
      transfer.status = 'success';
      transfer.progress = 1;
      transfer.error = null;
    },

    transferFailed: (
      state,
      { payload }: PayloadAction<{ id: string; error: string }>,
    ) => {
      const transfer = state.items[payload.id];
      if (!transfer) {
        return;
      }
      transfer.status = 'error';
      transfer.error = payload.error;
    },

    // Cancelled is a terminal state of its own, never an error: the UI shows it
    // as "cancelled", not as "failed".
    transferCancelled: (state, { payload }: PayloadAction<{ id: string }>) => {
      const transfer = state.items[payload.id];
      if (!transfer) {
        return;
      }
      transfer.status = 'cancelled';
      transfer.error = null;
    },

    transferCleared: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state.items[payload.id];
    },

    transfersCleared: state => {
      state.items = {};
    },
  },
});

export const {
  transferStarted,
  transferProgress,
  transferSucceeded,
  transferFailed,
  transferCancelled,
  transferCleared,
  transfersCleared,
} = slice.actions;

export default slice.reducer;

export const selectTransfer =
  (id: string) =>
  (state: { transfer: TransferState }): Transfer | undefined =>
    state.transfer.items[id];

export const selectHasRunningTransfer = (state: {
  transfer: TransferState;
}): boolean =>
  Object.values(state.transfer.items).some(item => item.status === 'running');
