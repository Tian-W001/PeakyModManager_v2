import React from 'react';
import './BottomBar.css';

interface ButtonProps {
  title: string;
  onClick: () => void;
}

function Button({ title, onClick }: ButtonProps) {
  return (
    <button className="Button" type="button" onClick={onClick}>
      {title}
    </button>
  );
}

function BottomBar() {
  return (
    <div className="BottomBarContainer">
      <Button
        title="Apply"
        onClick={() => {
          console.log('Apply');
        }}
      />
    </div>
  );
}

export default BottomBar;
