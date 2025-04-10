import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectModMetadataList } from "./modResourcesSlice";


const initialState: {modName: string | null} = {
  modName : null,
};

export const modalSlice = createSlice({
  name: "modEditModal",
  initialState,
  reducers: {
    openModEditModal: (state, action) => {
      state.modName = action.payload;
    },
    closeModEditModal: (state) => {
      state.modName = null;
    },
  },
});

export const { openModEditModal, closeModEditModal } = modalSlice.actions;
export default modalSlice.reducer;


/*
  Selectors
*/
export const selectModEditModalModName = 
  (state: RootState) => state.ModEditModal.modName;
export const selectModEditModalIsOpen = 
  (state: RootState) => state.ModEditModal.modName !== null;

export const selectModEditModalModMetadata = createSelector(
  [selectModMetadataList, selectModEditModalModName], 
  (metadataList, modName) => modName ? metadataList[modName] : undefined
);