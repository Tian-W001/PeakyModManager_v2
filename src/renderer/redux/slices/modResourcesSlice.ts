import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { TMetadata } from "../../../types/metadataType";

interface ModResourcesState {
  modResourcesPath: string;
  metadataList: TMetadata[];
  loading: boolean;
}

const initialState: ModResourcesState = {
  modResourcesPath: "",
  metadataList: [],
  loading: true,
};

export const fetchModResourcesPath = createAsyncThunk(
  'modResources/fetchModResourcesPath',
  async () => {
    return await window.electron.getModResourcesPath();
  }
);

export const fetchModResourcesMetadata = createAsyncThunk(
  'modResources/fetchModResourcesMetadata',
  async () => {
    return await window.electron.fetchModResourcesMetadata();
  }
);

export const modResourcesSlice = createSlice({
  name: 'modResources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModResourcesPath.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModResourcesPath.fulfilled, (state, action) => {
        state.modResourcesPath = action.payload;
      })
      .addCase(fetchModResourcesMetadata.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModResourcesMetadata.fulfilled, (state, action) => {
        state.metadataList = action.payload;
        state.loading = false;
      });
  },
});

export default modResourcesSlice.reducer;
