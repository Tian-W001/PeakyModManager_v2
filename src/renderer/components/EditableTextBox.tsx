import React, { useState, useRef, useEffect } from "react";
import "../App.scss";

type EditableTextBoxProps = React.ComponentProps<'textarea'> & {
  title?: string;
  text: string;
};

const EditableTextBox = ({ title, text, ...props }: EditableTextBoxProps) => {
  
  return (
    <div className="EditableTextBoxContainer">
      {title && <label>{title}: </label>}
      <textarea
        value={text} 
        className="TextBox" 
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        {...props}
      />
    </div>
  );
};

export default EditableTextBox;
