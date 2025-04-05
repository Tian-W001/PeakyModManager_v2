import { configureStore } from '@reduxjs/toolkit';
import modResourcesReducer from './slices/modResourcesSlice';
import modEditModalReducer from './slices/modEditModalSlice';

export const store = configureStore({
  reducer: {
    modResources: modResourcesReducer,
    ModEditModal: modEditModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
