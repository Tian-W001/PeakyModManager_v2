import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";
import { TModType } from "../../../types/modType";
import { TCharacter } from "../../../types/characterType";

interface MenuState {
  selectedModType: TModType | "All",
  selectedCharacter: TCharacter | "All",
};

const initialState: MenuState = {
  selectedModType: "All",
  selectedCharacter: "All",
};

export const menuSlice = createSlice({
  name: "menuSlice",
  initialState,
  reducers: {
    updateSelectedModType: (state, action) => {
      state.selectedModType = action.payload;
    },
    updateSelectedCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    }
  },
});

export const { updateSelectedModType, updateSelectedCharacter } = menuSlice.actions;
export default menuSlice.reducer;


export const selectCurrentModType =
  (state: RootState) => state.menu.selectedModType;

export const selectCurrentCharacter = 
  (state: RootState) => state.menu.selectedCharacter;
