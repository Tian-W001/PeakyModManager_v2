import React, { useState, useRef, useEffect } from "react";
import "../App.css";

type EditableTextBoxProps = {
  title?: string;
  text: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const EditableTextBox = ({ title, text, handleChange }: EditableTextBoxProps) => {
  
  return (
    <div className="EditableTextBoxContainer">
      {title && <span>{title}</span>}
      <textarea className="EditableTextBox" value={text} onChange={handleChange}/>
    </div>
  );
  
    
};
