import React, { useState, useRef, useEffect } from "react";
import "../App.scss";

type EditableTextBoxProps = {
  title?: string;
  text: string;
  rows: number;
  placeholder: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const EditableTextBox = ({ title, text, rows, placeholder, handleChange }: EditableTextBoxProps) => {
  
  return (
    <div className="EditableTextBoxContainer">
      {title && <div>{title}: </div>}
      <textarea 
        className="TextBox" 
        rows={rows}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
        value={text} 
        onChange={handleChange}
      />
    </div>
  );
};

export default EditableTextBox;
