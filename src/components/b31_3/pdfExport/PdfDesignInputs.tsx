"use client";
import React from "react";

export type DrawingInfo = {
  drawingNumber: string;
  drawingRevision: string;
  calculationRevision: string;
  date: string;
};


type PdfDesignInputsProps = {
  drawingInfo: DrawingInfo;
};

const PdfDesignInputs: React.FC<PdfDesignInputsProps> = ({
  drawingInfo,
}) => {
  return (
    <div>
        <div><strong>Drawing Number: </strong>{drawingInfo.drawingNumber} <strong>Rev: </strong>{drawingInfo.drawingRevision}</div>
        <div><strong>Calculation Rev: </strong>{drawingInfo.calculationRevision}</div>
        <div><strong>Date: </strong>{drawingInfo.date}</div>
      </div>
  );
};

export default PdfDesignInputs;
