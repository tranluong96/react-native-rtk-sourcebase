import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  Storage,
} from 'redux-persist';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

import { api } from '../services/api';
import theme from './theme';
import notification from './notification';
import network from './network';
import transfer from './transfer';

const reducers = combineReducers({
  theme,
  notification,
  network,
  transfer,
  [api.reducerPath]: api.reducer,
});

const storage = new MMKV();
export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['theme', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

const persistor = persistStore(store);

// Wire RTK Query's online/offline events to NetInfo so queries with
// `refetchOnReconnect` automatically refetch once the network is back.
setupListeners(store.dispatch, (dispatch, { onOnline, onOffline }) => {
  const subscription = NetInfo.addEventListener(state => {
    dispatch(state.isConnected ? onOnline() : onOffline());
  });
  return () => subscription();
});

export { store, persistor };
