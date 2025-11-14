"use client";
import React from "react";
import { Box} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { unitConversions } from "@/utils/unitConversions";
import { getAllowableStressForTemp } from "@/utils/materialsData";

export type DrawingInfo = {
  drawingNumber: string;
  drawingRevision: string;
  calculationRevision: string;
  date: string;
};

export type DesignParams = {
  pressure: number;
  temperature: number;
  allowableStress: number;
  corrosionAllowance: number;
  gamma: number;
  e: number;
  w: number;
  millTol: number;
};

type PdfDesignInputsProps = {
  drawingInfo: DrawingInfo;
  designParamsSingle?: DesignParams;
  designParamsMultiple?: DesignParams[];
  isMultiple?: boolean;
};

const rowStyle: React.CSSProperties = { display: "flex", alignItems: "center", marginBottom: 8 };
const labelStyle: React.CSSProperties = { fontWeight: "bold", minWidth: 220, marginRight: 8, whiteSpace: "nowrap" };
const valueStyle: React.CSSProperties = { minWidth: 100, textAlign: "right", marginRight: 8 };
const unitStyle: React.CSSProperties = { minWidth: 80 };

const PdfDesignInputs: React.FC<PdfDesignInputsProps> = ({
  drawingInfo,
  designParamsSingle,
  designParamsMultiple,
  isMultiple = false,
}) => {
  const globalDesign = useSelector((state: RootState) => state.single.global);
  const {pressure, temperature, selectedMaterial} = useSelector((state: RootState) => state.single);
  const units = useSelector((state: RootState) => state.single.currentUnit);
  const pressureConversion = unitConversions.pressure[units];
  const temperatureConversion = unitConversions.temperature[units];
  const lengthConversion = unitConversions.length[units];
const allowableStressFromMaterial = getAllowableStressForTemp(selectedMaterial, units, temperature);

  const designParamsList = isMultiple
    ? designParamsMultiple || []
    : designParamsSingle
    ? [designParamsSingle]
    : [];

  return (
    <Box sx={{ mb: 4 }}>
      {designParamsList.map((dp, idx) => (
        <Box key={idx} sx={{ mb: 2, borderBottom: "1px solid #ddd", pb: 1 }}>
          <div style={rowStyle}>
          <div style={labelStyle}>Drawing Number: {drawingInfo.drawingNumber}</div>
            <div style={labelStyle}>Revision: {drawingInfo.calculationRevision}</div>
            <div style={labelStyle}>Date: {drawingInfo.date}</div>
          </div>
          <div style={rowStyle}>
            <div style={labelStyle}>Design Pressure:</div>
            <div style={valueStyle}>{pressureConversion.to(pressure).toFixed(2)}</div>
            <div style={unitStyle}>{pressureConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Design Temperature:</div>
            <div style={valueStyle}>{temperatureConversion.to(temperature).toFixed(0)}</div>
            <div style={unitStyle}>{temperatureConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Corrosion Allowance:</div>
            <div style={valueStyle}>{globalDesign.corrosionAllowance}</div>
            <div style={unitStyle}>{lengthConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Maximum Allowable Stress:</div>
            <div style={valueStyle}>{pressureConversion.to(allowableStressFromMaterial).toFixed(2)}</div>
            <div style={unitStyle}>{pressureConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Temperature Coefficient, γ:</div>
            <div style={valueStyle}>{globalDesign.gamma}</div>
            <div style={unitStyle}></div>
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default PdfDesignInputs;
