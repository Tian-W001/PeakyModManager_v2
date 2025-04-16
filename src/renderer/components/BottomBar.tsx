import React, { useCallback } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchModResourcesMetadata, applyMods } from '../redux/slices/modResourcesSlice';
import { SettingsModal } from './SettingsModal';
import { selectModResourcesPath } from '../redux/slices/settingsSlice';
import { Button } from './Button';

function BottomBar() {
  const dispatch = useAppDispatch();

  const modResourcesPath = useAppSelector(selectModResourcesPath);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const refreshMods = useCallback(() => {
    dispatch(fetchModResourcesMetadata());
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
            title="Settings"
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
          />
          <Button
            title="Refresh"
            onClick={refreshMods}
          />
        </div>
        
        <div className="ButtonGroup flexEnd">
          <Button
            title="Launcher"
            onClick={openModLauncher}
          />
          <Button
            title="mod resources"
            onClick={handleOpenModResourcesFolder}
          />
          <Button
            title="Apply"
            onClick={handleApplyMods}
          />
        </div>
      </div>
    </>
  );
}

export default BottomBar;
