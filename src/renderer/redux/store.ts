import { configureStore } from '@reduxjs/toolkit';
import modResourcesReducer from './slices/modResourcesSlice';
import modEditModalReducer from './slices/modEditModalSlice';
import settingsReducer from './slices/settingsSlice';
import menuSlice from './slices/menuSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    modResources: modResourcesReducer,
    ModEditModal: modEditModalReducer,
    menu: menuSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
