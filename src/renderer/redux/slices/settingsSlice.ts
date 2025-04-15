import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TLanguage } from "../../../types/languageType";

interface SettingsState {
  modResourcesPath: string;
  targetPath: string;
  launcherPath: string;
  gamePath: string;
  language: TLanguage;
};

const initialState: SettingsState = {
  modResourcesPath: "",
  targetPath: "",
  launcherPath: "",
  gamePath: "",
  language: "en",
};


export const updateModResourcesPath = createAsyncThunk(
  'settings/updateModResourcesPath',
  async (newPath: string) => {
    await window.electron.setModResourcesPath(newPath);
    return newPath;
  }
);
export const fetchModResourcesPath = createAsyncThunk(
  'settings/fetchModResourcesPath',
  async () => {
    return await window.electron.getModResourcesPath();
  }
);

export const updateTargetPath = createAsyncThunk(
  'settings/updateTargetPath',
  async (newPath: string) => {
    await window.electron.setTargetPath(newPath);
    return newPath;
  }
);
export const fetchTargetPath = createAsyncThunk(
  'settings/fetchTargetPath',
  async () => {
    return await window.electron.getTargetPath();
  }
);
export const updateLauncherPath = createAsyncThunk(
  'settings/updateLauncherPath',
  async (newPath: string) => {
    console.log("set launcher path", newPath);
    await window.electron.setLauncherPath(newPath);
    return newPath;
  }
);
export const fetchLauncherPath = createAsyncThunk(
  'settings/fetchLauncherPath',
  async () => {
    return await window.electron.getLauncherPath();
  }
);
export const updateGamePath = createAsyncThunk(
  'settings/updateGamePath',
  async (newPath: string) => {
    await window.electron.setGamePath(newPath);
    return newPath;
  }
);
export const fetchGamePath = createAsyncThunk(
  'settings/fetchGamePath',
  async () => {
    return await window.electron.getGamePath();
  }
);


export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<TLanguage>) {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateModResourcesPath.fulfilled, (state, action) => {
        state.modResourcesPath = action.payload;
      })
      .addCase(fetchModResourcesPath.fulfilled, (state, action) => {
        state.modResourcesPath = action.payload;
      })
      .addCase(updateTargetPath.fulfilled, (state, action) => {
        state.targetPath = action.payload;
      })
      .addCase(fetchTargetPath.fulfilled, (state, action) => {
        state.targetPath = action.payload;
      })
      .addCase(updateLauncherPath.fulfilled, (state, action) => {
        state.launcherPath = action.payload;
      })
      .addCase(fetchLauncherPath.fulfilled, (state, action) => {
        state.launcherPath = action.payload;
      })
      .addCase(updateGamePath.fulfilled, (state, action) => {
        state.gamePath = action.payload;
      })
      .addCase(fetchGamePath.fulfilled, (state, action) => {
        state.gamePath = action.payload;
      });
  },
});

export const { setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectModResourcesPath = (state: RootState) => state.settings.modResourcesPath;
export const selectTargetPath = (state: RootState) => state.settings.targetPath;
export const selectLauncherPath = (state: RootState) => state.settings.launcherPath;
export const selectGamePath = (state: RootState) => state.settings.gamePath;
export const selectLanguage = (state: RootState) => state.settings.language;
