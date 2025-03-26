import { createSelector } from "reselect";
import { RootState } from "../store";
import { Tmod } from "../../../types/modType";

export const selectModResources = (state: RootState) => state.modResources;
export const selectModResourcesPath = (state: RootState) => state.modResources.modResourcesPath;
export const selectModResourcesLoading = (state: RootState) => state.modResources.loading;
export const selectModMetadataList = (state: RootState) => state.modResources.metadataList;

export const selectModMetadataListByType = createSelector(
  [selectModMetadataList, (state: RootState, modType: Tmod) => modType],
  (metadataList, modType) => metadataList.filter((metadata) => metadata.modType === modType)
);

export const selectModMetadataByName = (modName: string) => 
  createSelector(
    [selectModMetadataList],
    (metadataList) => metadataList.find((metadata) => metadata.name === modName)
  );
