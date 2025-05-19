// components/PdfPipeOutputs.tsx

import React from "react";
import { DesignParameters, Units } from "@/types/units";
import { unitConversions, unitLabels } from "@/utils/unitConversions";

type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number;
  t: number;
};

type PdfPipeOutputsProps = {
  pipes: Pipe[];
  designParams: DesignParameters;

  material: string;
  
};

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  marginRight: 5,
};

const valueStyle: React.CSSProperties = {
  marginBottom: 8,
  display: "block",
};

const fractionStyle: React.CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  fontSize: 12,
  lineHeight: 1,
  marginLeft: 4,
  marginRight: 4,
};

const numeratorStyle: React.CSSProperties = {
  padding: "0 4px",
  textAlign: "center",
};

const denominatorStyle: React.CSSProperties = {
  padding: "0 4px",
  marginTop: 2,
  textAlign: "center",
  borderTop: "1px solid #000",
};

const PdfPipeOutputs: React.FC<PdfPipeOutputsProps> = ({
  pipes,
  material,designParams,
}) => {
    const { units, pressure, corrosionAllowance, allowableStress, e, w, gamma } =
        designParams;
  const unit = unitLabels[units];
  return (
    <>
      {pipes.map((pipe, index) => (
        <div
          key={pipe.id}
          style={{
            borderTop: "1px solid #ccc",
            paddingTop: 10,
            marginTop: 16,
          }}
        >
          <div style={valueStyle}>
            <strong>Pipe {index + 1}</strong> — For {pipe.nps}
            {unitLabels[units].length} SCH {pipe.schedule} {material} (t = {pipe.t.toFixed(2)}):
          </div>
          <div style={valueStyle}>
            <span style={labelStyle}>Required Thickness (tᵣ):</span>{" "}
            {pipe.tRequired.toFixed(2)} {unitConversions.thickness[units].unit}
          </div>

          {/* Formula */}
          <div style={{ marginTop: 8 }}>
            <div>
              <span>tᵣ = (</span>

              <span style={fractionStyle}>
                <span style={numeratorStyle}>P × D</span>
                <span style={denominatorStyle}>2(SEW + Pγ)</span>
              </span>
              <span>+ CA ) × </span>

              <span style={fractionStyle}>
                <span style={numeratorStyle}>1</span>
                <span style={denominatorStyle}>(1 - Mill Tolerance)</span>
              </span>
            </div>
          </div>

          {/* Formula */}
          <div style={{ marginTop: 8 }}>
            <div>
              <span>tᵣ = (</span>

              <span style={fractionStyle}>
                <span style={numeratorStyle}>{pressure}{unitLabels[units].pressure} × D</span>
                <span style={denominatorStyle}>2(({allowableStress}{unitLabels[units].pressure})({e})({w}) + ({pressure}{unitLabels[units].pressure})({gamma}))</span>
              </span>

              <span>+ {corrosionAllowance} {unitLabels[units].length}) × </span>

              <span style={fractionStyle}>
                <span style={numeratorStyle}>1</span>
                <span style={denominatorStyle}>(1 - Mill Tolerance)</span>
              </span>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <div>
              <span>tᵣ = {pipe.tRequired.toFixed(2)} {unitConversions.thickness[units].unit}</span>

             
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div>
              <span>tᵣ &lt; t ∴ </span>

             
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PdfPipeOutputs;
