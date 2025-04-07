import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { TMetadata } from "../../../types/metadataType";

import { createSelector } from "reselect";
import { RootState } from "../store";
import { Tmod } from "../../../types/modType";
import { useMemo } from "react";

interface ModResourcesState {
  metadataList: Record<string, TMetadata>;
  diffList: Record<string, boolean>;
}

const initialState: ModResourcesState = {
  metadataList: {},
  diffList: {},
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

export const addNewMod = createAsyncThunk(
  'modEditModal/addNewMod',
  async (
    { modName, srcModPath }: {modName: string, srcModPath: string},
    { rejectWithValue }
  ) => {
    const newMetadata = await window.electron.addNewMod(srcModPath);
    if (!newMetadata) {
      return rejectWithValue('Add Mod Failed');
    }
    return { modName, newMetadata };
  }
);

export const deleteMod = createAsyncThunk(
  'modEditModal/deleteMod',
  async (modName: string, { rejectWithValue }) => {
    const success = await window.electron.deleteMod(modName);
    if (!success) {
      return rejectWithValue('Delete Mod Failed');
    }
    return modName;
  }
);

export const applyMods = createAsyncThunk(
  'modResources/applyMods',
  async (_, {getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const diffList = state.modResources.diffList;
    const success = await window.electron.applyMods(diffList);
    if (!success) {
      return rejectWithValue('Apply Mods Failed');
    }
    return diffList;
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
  reducers: {
    updateDiffList: (state, action) => {
      const { modName, isActive } = action.payload;
      const oldActive = state.metadataList[modName]?.active;
      if (oldActive !== undefined) {
        if (oldActive !== isActive) {
          state.diffList[modName] = isActive;
        } else {
          delete state.diffList[modName];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModResourcesMetadata.fulfilled, (state, action) => {
        state.metadataList = action.payload;
      })
      .addCase(updateMod.fulfilled, (state, action) => {
        const { modName, newMetadata } = action.payload;
        state.metadataList[modName] = newMetadata;
      })
      .addCase(addNewMod.fulfilled, (state, action) => {
        const { modName, newMetadata } = action.payload;
        state.metadataList[modName] = newMetadata;
      })
      .addCase(deleteMod.fulfilled, (state, action) => {
        const modName = action.payload;
        delete state.metadataList[modName];
      })
      .addCase(applyMods.fulfilled, (state, action) => {
        const diffList = action.payload;
        for (const [modName, isActive] of Object.entries(diffList)) {
          state.metadataList[modName].active = isActive;
        }
        state.diffList = {};
      });
  },
});

export const { updateDiffList } = modResourcesSlice.actions;
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
