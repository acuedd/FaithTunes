// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // usa localStorage
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import playlistReducer from './slices/playlistSlice';
import songReducer from './slices/songSlice';
import playerReducer from './slices/playerSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  playlist: playlistReducer,
  song: songReducer,
  player: playerReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;