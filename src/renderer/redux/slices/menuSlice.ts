import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";
import { defaultModType, modTypeList, TModType } from "../../../types/modType";

interface MenuState {
  selectedModType: TModType | "All",
};

const initialState: MenuState = {
  selectedModType: "All",
};

export const menuSlice = createSlice({
  name: "menuSlice",
  initialState,
  reducers: {
    updateSelectedModType: (state, action) => {
      state.selectedModType = action.payload;
    },
  },
});

export const { updateSelectedModType } = menuSlice.actions;
export default menuSlice.reducer;


export const selectCurrentModType =
  (state: RootState) => state.menu.selectedModType;
