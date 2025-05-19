import React from "react";
import { DesignParameters } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type PdfDesignInputsProps = {
  drawingNumber: string;
  drawingRevision: string;
  calculationRevision: string;
  date: string;
  designParams: DesignParameters;
};

const cellStyle: React.CSSProperties = {
  padding: "4px 8px",
  verticalAlign: "top",
};

const labelStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: "bold",
  width: 200,
  whiteSpace: "nowrap",           // Prevent wrapping
  overflow: "hidden",
  textOverflow: "ellipsis",       // Optional: adds "..." if too long
};

const valueStyle: React.CSSProperties = {
  ...cellStyle,
  width: 100,
  textAlign: "right",
  paddingRight: 4,
};

const unitStyle: React.CSSProperties = {
  ...cellStyle,
  width: 100,
};

const PdfDesignInputs: React.FC<PdfDesignInputsProps> = ({
  drawingNumber,
  drawingRevision,
  calculationRevision,
  date,
  designParams,
}) => {
    const { units, pressure, temperature, corrosionAllowance, allowableStress, gamma } = designParams;

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>Drawing Number:</span>{" "}
          {drawingNumber}{" "}
          <span style={{ fontWeight: "bold", marginLeft: 16 }}>Revision:</span>{" "}
          {drawingRevision}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Date:</span> {date}
        </div>
      </div>

      {/* Table for Design Inputs */}
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={labelStyle}>Calculation Revision:</td>
            <td style={valueStyle}>{calculationRevision}</td>
            <td style={unitStyle}></td>
          </tr>
          <tr>
            <td style={labelStyle}>Units:</td>
            <td style={valueStyle}>{units}</td>
            <td style={unitStyle}></td>
          </tr>
          <tr>
            <td style={labelStyle}>Design Pressure:</td>
            <td style={valueStyle}>{pressure}</td>
            <td style={unitStyle}>{unitConversions.pressure[designParams.units].unit}</td>
          </tr>
          <tr>
            <td style={labelStyle}>Design Temperature:</td>
            <td style={valueStyle}>{temperature}</td>
            <td style={unitStyle}>{unitConversions.temperature[designParams.units].unit}</td>
          </tr>
          <tr>
            <td style={labelStyle}>Corrosion Allowance:</td>
            <td style={valueStyle}>{corrosionAllowance}</td>
            <td style={unitStyle}>{unitConversions.length[designParams.units].unit}</td>
          </tr>
          <tr>
            <td style={labelStyle}>Maximum Allowable Stress:</td>
            <td style={valueStyle}>{allowableStress}</td>
            <td style={unitStyle}>{unitConversions.pressure[designParams.units].unit}</td>
          </tr>
          <tr>
            <td style={labelStyle}>Temperature Coefficient, γ:</td>
            <td style={valueStyle}>{gamma ?? ""}</td>
            <td style={unitStyle}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PdfDesignInputs;
