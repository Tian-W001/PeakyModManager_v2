import { configureStore } from '@reduxjs/toolkit';
import modResourcesReducer from './modResources/modResourcesSlice';
import modEditModalReducer from './modEditModal/modEditModalSlice';

export const store = configureStore({
  reducer: {
    modResources: modResourcesReducer,
    ModEditModal: modEditModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
