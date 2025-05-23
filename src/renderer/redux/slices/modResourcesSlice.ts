import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { TMetadata } from "../../../types/metadataType";

import { createSelector } from "reselect";
import { RootState } from "../store";
import { TModType } from "../../../types/modType";

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

export const disableAllMods = createAsyncThunk(
  'modResources/disableAllMods',
  async () => {
    return await window.electron.disableAllMods();
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
    clearDiffList: (state) => {
      state.diffList = {};
    },
    resetDiffList: (state) => {
      for (const modName in state.metadataList) {
        // if the mod is active and not in diffList, add it to diffList
        if (state.metadataList[modName].active && state.diffList[modName] !== false) {
          state.diffList[modName] = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModResourcesMetadata.fulfilled, (state, action) => {
        const newMetadataList = action.payload;
        if (newMetadataList)
          state.metadataList = action.payload;
      })
      .addCase(updateMod.fulfilled, (state, action) => {
        const { modName, newMetadata } = action.payload;
        state.metadataList = {
          ...state.metadataList,
          [modName]: newMetadata
        }
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
      })
      .addCase(disableAllMods.fulfilled, (state) => {
        for (const modName in state.metadataList) {
          state.metadataList[modName].active = false;
        }
      });
  },
});

export const { updateDiffList, clearDiffList, resetDiffList } = modResourcesSlice.actions;
export default modResourcesSlice.reducer;


/* 
  Selectors
*/
export const selectModMetadataList = (state: RootState) => state.modResources.metadataList;
export const selectDiffList = (state: RootState) => state.modResources.diffList;

export const makeSelectModMetadataByName = (modName: string) => 
  createSelector(
    [selectModMetadataList],
    metadataList => metadataList[modName]
  );
