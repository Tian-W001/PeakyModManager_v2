import React from "react";
import exitButtonImg from "../../../assets/zzz_exit_button.png";

import '../../App.css';

type ExitButtonProps = {
  onClick: (event: React.MouseEvent<HTMLImageElement>) => void;
  className?: string;
};

const ExitButton: React.FC<ExitButtonProps> = ({ onClick=()=>{}, className=''}) => {
  return (
    <img
      onClick={onClick}
      className={`ExitButtonImg ${className}`}
      src={exitButtonImg}
      alt="exit button"
    />
  );
};

export default ExitButton;
