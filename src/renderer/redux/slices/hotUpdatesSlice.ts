import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { updateCharacterTranslations } from "../../i18n";

interface HotUpdatesState {
  characters: string[] | null;
};

const initialState: HotUpdatesState = {
  characters: null,
};

export const fetchCharacters = createAsyncThunk(
  'hotUpdates/fetchCharacters',
  async (_, { rejectWithValue }) => {
    const charactersInfoList = await window.electron.fetchCharacters();
    if (!charactersInfoList) {
      return rejectWithValue('Fetch Characters Failed');
    }
    await updateCharacterTranslations();
    return charactersInfoList;
  }
);

export const getCharacters = createAsyncThunk(
  'hotUpdates/getCharacters',
  async (_, { rejectWithValue }) => {
    const charactersInfoList = await window.electron.getCharacters();
    if (!charactersInfoList) {
      return rejectWithValue('Fetch Characters Failed');
    }
    await updateCharacterTranslations();
    return charactersInfoList;
  }
);

export const hotUpdatesSlice = createSlice({
  name: "hotUpdatesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.characters = action.payload.characterList;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        console.error(action.payload);
      })
      .addCase(getCharacters.fulfilled, (state, action) => {
        state.characters = action.payload.characterList;
      })
      .addCase(getCharacters.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export default hotUpdatesSlice.reducer;

export const selectCharacters = 
  (state: RootState) => state.hotUpdates.characters;
