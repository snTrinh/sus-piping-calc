import React from "react";
import { DesignParams } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";
import { Box, Typography } from "@mui/material";

export type DrawingInfo = {
  drawingNumber: string;
  drawingRevision: string;
  calculationRevision: string;
  date: string;
};

type PdfDesignInputsProps = {
  drawingInfo: DrawingInfo;
  designParams: DesignParams;
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
  designParams,
}) => {
  const {
    units,
    pressure,
    temperature,
    corrosionAllowance,
    allowableStress,
    gamma,
  } = designParams;


  const pressureConversion = unitConversions.pressure[units];
  const temperatureConversion = unitConversions.temperature[units];
  const lengthConversion = unitConversions.length[units];

  return (
    <Box sx={{ mb: 4 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Typography fontWeight="bold">Drawing Number:</Typography>
          <Typography>{drawingInfo.drawingNumber}</Typography>
          <Typography fontWeight="bold" sx={{ ml: 2 }}>
            Revision:
          </Typography>
          <Typography>{drawingInfo.drawingRevision}</Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold" display="inline">
            Date:
          </Typography>{" "}
          <Typography display="inline">{drawingInfo.date}</Typography>
        </Box>
      </Box>


      <Box>
        <div style={rowStyle}>
          <div style={labelStyle}>Calculation Revision:</div>
          <div style={valueStyle}>{drawingInfo.calculationRevision}</div>
          <div style={unitStyle}></div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Units:</div>
          <div style={valueStyle}>{units}</div>
          <div style={unitStyle}></div>
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
          <div style={valueStyle}>{corrosionAllowance}</div>
          <div style={unitStyle}>{lengthConversion.unit}</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Maximum Allowable Stress:</div>
          <div style={valueStyle}>{pressureConversion.to(allowableStress ?? 0).toFixed(2)}</div>
          <div style={unitStyle}>{pressureConversion.unit}</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Temperature Coefficient, γ:</div>
          <div style={valueStyle}>{gamma ?? ""}</div>
          <div style={unitStyle}></div>
        </div>
      </Box>
    </Box>
  );
};

export default PdfDesignInputs;
