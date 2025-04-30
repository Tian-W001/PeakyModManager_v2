import React, { useState, useRef, useEffect } from "react";
import "../App.scss";

type EditableTextBoxProps = {
  title?: string;
  text: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const EditableTextBox = ({ title, text, handleChange }: EditableTextBoxProps) => {
  
  return (
    <div className="EditableTextBoxContainer">
      {title && <span>{title}: </span>}
      <textarea className="EditableTextBox" rows={1} value={text} onChange={handleChange}/>
    </div>
  );
};

export default EditableTextBox;
