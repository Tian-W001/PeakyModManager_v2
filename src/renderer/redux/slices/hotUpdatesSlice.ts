import { RootState } from "../store";
import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";

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
      });
  },
});