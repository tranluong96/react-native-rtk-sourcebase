import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'network',
  initialState: { isConnected: true } as NetworkState,
  reducers: {
    setConnected: (state, { payload: { isConnected } }: NetworkProps) => {
      state.isConnected = isConnected;
    },
  },
});

export const { setConnected } = slice.actions;

export default slice.reducer;

export type NetworkState = {
  isConnected: boolean;
};

type NetworkProps = {
  payload: NetworkState;
};
