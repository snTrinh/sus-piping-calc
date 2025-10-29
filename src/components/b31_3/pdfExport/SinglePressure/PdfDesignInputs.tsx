"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { unitConversions } from "@/utils/unitConversions";

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

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: 8,
};

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  minWidth: 220,
  marginRight: 8,
  whiteSpace: "nowrap",
};

const valueStyle: React.CSSProperties = {
  minWidth: 100,
  textAlign: "right",
  marginRight: 8,
};

const unitStyle: React.CSSProperties = {
  minWidth: 80,
};

const PdfDesignInputs: React.FC<PdfDesignInputsProps> = ({
  drawingInfo,
  designParamsSingle,
  designParamsMultiple,
  isMultiple = false,
}) => {
  const units = useSelector((state: RootState) => state.unit.currentUnit);
  const pressureConversion = unitConversions.pressure[units];
  const temperatureConversion = unitConversions.temperature[units];
  const lengthConversion = unitConversions.length[units];

  const { pressure, temperature } = useSelector(
    (state: RootState) => state.single
  );
  
  const designParamsList = isMultiple
    ? designParamsMultiple || []
    : designParamsSingle
    ? [designParamsSingle]
    : [];

  return (
    <Box sx={{ mb: 4 }}>
      {designParamsList.map((dp, idx) => (
        <Box key={idx} sx={{ mb: 2, borderBottom: "1px solid #ddd", pb: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1 }}>
            <Typography fontWeight="bold">Drawing Number:</Typography>
            <Typography>{drawingInfo.drawingNumber}</Typography>
            <Typography fontWeight="bold">Revision:</Typography>
            <Typography>
              {drawingInfo.calculationRevision}
              {isMultiple ? `.${idx + 1}` : ""}
            </Typography>
            <Typography fontWeight="bold">Date:</Typography>
            <Typography>{drawingInfo.date}</Typography>
          </Box>

          <div style={rowStyle}>
            <div style={labelStyle}>Design Pressure:</div>
            <div style={valueStyle}>
              {pressureConversion.to(pressure).toFixed(2)}
            </div>
            <div style={unitStyle}>{pressureConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Design Temperature:</div>
            <div style={valueStyle}>
              {temperatureConversion.to(temperature).toFixed(0)}
            </div>
            <div style={unitStyle}>{temperatureConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Corrosion Allowance:</div>
            <div style={valueStyle}>{dp.corrosionAllowance}</div>
            <div style={unitStyle}>{lengthConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Maximum Allowable Stress:</div>
            <div style={valueStyle}>
              {pressureConversion.to(dp.allowableStress).toFixed(2)}
            </div>
            <div style={unitStyle}>{pressureConversion.unit}</div>
          </div>

          <div style={rowStyle}>
            <div style={labelStyle}>Temperature Coefficient, γ:</div>
            <div style={valueStyle}>{dp.gamma}</div>
            <div style={unitStyle}></div>
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default PdfDesignInputs;
