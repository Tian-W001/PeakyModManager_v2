import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectModMetadataList } from "../modResources/modResourcesSlice";


const initialState: {modName: string | null} = {
  modName : null,
};

const modalSlice = createSlice({
  name: "modEditModal",
  initialState,
  reducers: {
    openModEditModal: (state, action: PayloadAction<string>) => {
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
  (metadataList, modName) => metadataList.find((metadata) => metadata.name === modName)
);