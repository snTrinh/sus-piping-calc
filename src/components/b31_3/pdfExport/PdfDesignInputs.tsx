import React from "react";
import { DesignParameters } from "@/types/units";
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
  designParams: DesignParameters;
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

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Typography fontWeight="bold">
            Drawing Number:
          </Typography>
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

      {/* Styled Inputs Table */}
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
          <div style={valueStyle}>{pressure}</div>
          <div style={unitStyle}>
            {unitConversions.pressure[units].unit}
          </div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Design Temperature:</div>
          <div style={valueStyle}>{temperature}</div>
          <div style={unitStyle}>
            {unitConversions.temperature[units].unit}
          </div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Corrosion Allowance:</div>
          <div style={valueStyle}>{corrosionAllowance}</div>
          <div style={unitStyle}>
            {unitConversions.length[units].unit}
          </div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Maximum Allowable Stress:</div>
          <div style={valueStyle}>{allowableStress}</div>
          <div style={unitStyle}>
            {unitConversions.pressure[units].unit}
          </div>
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
