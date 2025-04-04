import React, { useCallback } from 'react';
import '../../App.css';
import clsx from 'clsx';
import { useAppDispatch } from '../../redux/hooks';
import { fetchModResourcesMetadata } from '../../redux/modResources/modResourcesSlice';
import { electron } from 'process';


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

  const refreshMods = useCallback(() => {
    dispatch(fetchModResourcesMetadata());
  }, []);

  const openModLauncher = useCallback(async () => {
    const error = await window.electron.openModLauncher();
    if (error) {
      console.log(error);
    }
  }, []);



  return (
    <>
      {console.log('BottomBar rendererd')}
      <div className="BottomBarContainer">
        <ButtonGroup>
          <Button
            title="Settings"
            onClick={() => {
              console.log('Settings');
            }}
          />
          <Button
            title="Refresh"
            onClick={() => {
              console.log("Refresh");
              refreshMods();
            }}
          />
        </ButtonGroup>
        
        <ButtonGroup>
          <Button
            title="Launcher"
            onClick={async () => {
              console.log('Launcher');
              await openModLauncher();
            }}
          />
          <Button
            title="Game"
            onClick={() => {
              console.log('Game');
            }}
          />
          <Button
            title="Apply"
            onClick={() => {
              console.log('Apply');
            }}
          />
        </ButtonGroup>
      </div>
    </>
  );
}

export default BottomBar;
