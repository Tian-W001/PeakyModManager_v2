import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TMetadata } from "../../../types/metadataType";

import { createSelector } from "reselect";
import { RootState } from "../store";
import { Tmod } from "../../../types/modType";
import { useMemo } from "react";

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


export const selectModResources = (state: RootState) => state.modResources;
export const selectModResourcesPath = (state: RootState) => state.modResources.modResourcesPath;
export const selectModResourcesLoading = (state: RootState) => state.modResources.loading;
export const selectModMetadataList = (state: RootState) => state.modResources.metadataList;

export const selectModMetadataListByType = (modType: Tmod | null | undefined) => 
  useMemo(() => 
    createSelector(
      [selectModMetadataList], 
      (metadataList) => metadataList.filter((metadata) => metadata.modType === modType)
    ),
    []
  );

export const selectModMetadataByName = (modName: string | null | undefined) => 
  useMemo(() => 
    createSelector(
      [selectModMetadataList],
      (metadataList) => metadataList.find((metadata) => metadata.name === modName)
    ), 
    []
  );
