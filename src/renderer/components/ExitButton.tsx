import React from "react";
import exitButtonImg from "../assets/zzz_exit_button.png";

import '../App.css';

type ExitButtonProps = React.ComponentProps<'button'> & {
  className?: string;
};

const ExitButton = ({ className='', ...props }: ExitButtonProps) => {
  return (
    <button className={`ExitButtonContainer ${className}`} {...props}>
      <img
        className={`ExitButtonImg`}
        src={exitButtonImg}
        alt="exit button"
      />
    </button>
  );
};

export default ExitButton;
