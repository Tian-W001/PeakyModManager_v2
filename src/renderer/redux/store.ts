import { configureStore } from '@reduxjs/toolkit';
import modResourcesReducer from './slices/modResourcesSlice';

export const store = configureStore({
  reducer: {
    modResources: modResourcesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
