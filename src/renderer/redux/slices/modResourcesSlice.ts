import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { TMetadata } from "../../../types/metadataType";

import { createSelector } from "reselect";
import { RootState } from "../store";
import { Tmod } from "../../../types/modType";
import { useMemo } from "react";

interface ModResourcesState {
  modResourcesPath: string;
  metadataList: Record<string, TMetadata>;
  loading: boolean;
}

const initialState: ModResourcesState = {
  modResourcesPath: "",
  metadataList: {},
  loading: true,
};

export const updateMod = createAsyncThunk(
  'modEditModal/updateMod',
  async (
    { modName, newMetadata }: {modName: string, newMetadata: TMetadata}, 
    { rejectWithValue }
  ) => {
    const success = await window.electron.updateMod(modName, newMetadata);
    if (!success) {
      return rejectWithValue('Update Mod Failed');
    }
    return { modName, newMetadata };
  }
);

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
      })

      .addCase(updateMod.fulfilled, (state, action) => {
        const { modName, newMetadata } = action.payload;
        state.metadataList[modName] = newMetadata;
      });
  },
});

export default modResourcesSlice.reducer;


/* 
  Selectors
*/
export const selectModResources = (state: RootState) => state.modResources;
export const selectModResourcesPath = (state: RootState) => state.modResources.modResourcesPath;
export const selectModResourcesLoading = (state: RootState) => state.modResources.loading;
export const selectModMetadataList = (state: RootState) => state.modResources.metadataList;

export const selectModMetadataListByType = (modType: Tmod | null | undefined) => 
  useMemo(() => 
    createSelector(
      [selectModMetadataList], 
      metadataList => {
        return Object.fromEntries(
          Object.entries(metadataList).filter(([__dirname, metadata]) => modType === metadata.modType)
        )
      }
    ),
    []
  );

export const selectModMetadataByName = (modName: string | null | undefined) => 
  useMemo(() => 
    createSelector(
      [selectModMetadataList],
      metadataList => modName ? metadataList[modName] : undefined
    ), 
    []
  );
