import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'notification',
  initialState: { amountBadge: 0 } as NotificationState,
  reducers: {
    incrementBadge: (state, { payload: { amountBadge = 0 } }: NotificationProps) => {
      state.amountBadge = amountBadge + 1
    },
    decrementBadge: (state) => {
      if (state.amountBadge > 0) {
        state.amountBadge = state.amountBadge - 1
      }
    }
  },
});

export const { incrementBadge, decrementBadge } = slice.actions;

export default slice.reducer;

export type NotificationState = {
  amountBadge: number
}

type NotificationProps = {
  payload: Partial<NotificationState>
}

