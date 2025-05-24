import { configureStore } from '@reduxjs/toolkit';
import modResourcesReducer from './slices/modResourcesSlice';
import modEditModalReducer from './slices/modEditModalSlice';
import settingsReducer from './slices/settingsSlice';
import menuSlice from './slices/menuSlice';
import hotUpdatesSlice from './slices/hotUpdatesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    modResources: modResourcesReducer,
    ModEditModal: modEditModalReducer,
    menu: menuSlice,
    hotUpdates: hotUpdatesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
