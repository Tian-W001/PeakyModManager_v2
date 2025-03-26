import React from "react";
import { TMetadata } from "../../../types/metadataType";

interface ModEditModalProps {
  modData: TMetadata;
}

export const ModEditModal = ({ modData }: ModEditModalProps) => {
  return (
    <div className="ModEditModalContainer">
      <div className="ModEditModalTitle">{modData.name}</div>
      <div className="ModEditModalDesc">{modData.description}</div>
    </div>
  );
};
