import React, { useCallback } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchModResourcesMetadata, applyMods } from '../redux/slices/modResourcesSlice';
import { SettingsModal } from './SettingsModal';
import { selectModResourcesPath } from '../redux/slices/settingsSlice';

type ButtonProps = React.ComponentProps<'button'> & {
  title: string;
  className?: string;
};

function Button({ title, className='', ...props }: ButtonProps) {
  return (
    <button className={`BottomBarButton ${className}`} {...props}>
      {title}
    </button>
  );
}

interface ButtonGroupProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}
function ButtonGroup({
  children,
  className = '',
  ...props
}: ButtonGroupProps) {
  const baseClassName = 'ButtonGroup';
  const classNames = `${baseClassName} ${className}`;

  return (
    <div className={classNames.trim()} {...props}>
      {children}
    </div>
  );
}


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
        <ButtonGroup>
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
        </ButtonGroup>
        
        <ButtonGroup>
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
        </ButtonGroup>
      </div>
    </>
  );
}

export default BottomBar;
