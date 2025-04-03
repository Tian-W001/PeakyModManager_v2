import React from "react";
import exitButtonImg from "../../../assets/zzz_exit_button.png";

type ExitButtonProps = {
  onClick: (event: React.MouseEvent<HTMLImageElement>) => void;
};

const ExitButton: React.FC<ExitButtonProps> = ({ onClick=()=>{}}) => {
  return (
    <img
      onClick={onClick}
      className="ExitButtonImg"
      src={exitButtonImg}
      alt="exit button"
    />
  );
};

export default ExitButton;
