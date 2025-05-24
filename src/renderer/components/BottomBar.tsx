import React, { useCallback, useTransition } from 'react';
import '../App.scss';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchModResourcesMetadata, applyMods, resetDiffList, selectDiffList } from '../redux/slices/modResourcesSlice';
import SettingsModal from './SettingsModal';
import { selectModResourcesPath } from '../redux/slices/settingsSlice';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

function BottomBar() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const modResourcesPath = useAppSelector(selectModResourcesPath);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const diffList = useAppSelector(selectDiffList);

  const refreshMods = useCallback(async () => {
    await dispatch(fetchModResourcesMetadata());
    dispatch(resetDiffList());
    await dispatch(applyMods());
  }, []);

  const openModLauncher = useCallback(async () => {
    const error = await window.electron.openModLauncher();
    if (error) {
      console.error(error);
    }
  }, []);

  const handleOpenModResourcesFolder = useCallback(async () => {
    const error = await window.electron.openFileExplorer(modResourcesPath);
    if (error) {
      console.error(error);
    }
  }, [modResourcesPath]);

  const handleApplyMods = useCallback(async () => {
    await dispatch(applyMods());
  }, []);

  return (
    <>
      {console.log('BottomBar rendererd')}
      <SettingsModal isOpen={isSettingsModalOpen} onRequestClose={() => setIsSettingsModalOpen(false)} />
      <div className="BottomBarContainer">
        <div className="ButtonGroup flexStart">
          <Button
            title={t("BottomBar.Settings")}
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
          />
          <Button
            title={t("BottomBar.Refresh")}
            onClick={refreshMods}
          />
        </div>
        
        <div className="ButtonGroup flexEnd">
          <Button
            title={t("BottomBar.Launcher")}
            onClick={openModLauncher}
          />
          <Button
            title={t("BottomBar.Resources")}
            onClick={handleOpenModResourcesFolder}
          />
          <Button
            className={Object.keys(diffList).length ? "highlight" : ""}
            title={t("BottomBar.Apply")}
            onClick={handleApplyMods}
          />
        </div>
      </div>
    </>
  );
}

export default BottomBar;
