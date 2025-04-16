import React from "react";


type ButtonProps = React.ComponentProps<'button'> & {
  title: string;
  className?: string;
};

export const Button = ({ title, className='', ...props }: ButtonProps) => {
  return (
    <button className={`Button ${className}`} {...props}>
      {title}
    </button>
  );
}