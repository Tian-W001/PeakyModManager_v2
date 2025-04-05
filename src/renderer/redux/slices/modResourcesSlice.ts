import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { TMetadata } from "../../../types/metadataType";

import { createSelector } from "reselect";
import { RootState } from "../store";
import { Tmod } from "../../../types/modType";
import { useMemo } from "react";

interface ModResourcesState {
  metadataList: Record<string, TMetadata>;
}

const initialState: ModResourcesState = {
  metadataList: {},
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
      .addCase(fetchModResourcesMetadata.fulfilled, (state, action) => {
        state.metadataList = action.payload;
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
