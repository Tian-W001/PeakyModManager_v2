import React from 'react';
import './BottomBar.css';
import clsx from 'clsx';


interface ButtonProps extends React.ComponentProps<'button'> {
  title: string;
}
function Button({ className = '', title, ...props }: ButtonProps) {
  const baseClassName = 'Button';
  const classNames = clsx(baseClassName, className);

  return (
    <button className={classNames.trim()} {...props}>
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
  return (
    <div className="BottomBarContainer">
      <ButtonGroup>
        <Button
          title="Settings"
          onClick={() => {
            console.log('Settings');
          }}
        />
      </ButtonGroup>
      
      <ButtonGroup>
        <Button
          title="Launcher"
          onClick={() => {
            console.log('Launcher');
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
  );
}

export default BottomBar;
