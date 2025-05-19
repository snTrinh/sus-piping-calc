// components/PdfPipeOutputs.tsx

import React from "react";
import { DesignParameters } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

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
  material,
  designParams,
}) => {
  const { units, pressure, corrosionAllowance, allowableStress, e, w, gamma } =
    designParams;
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
            {unitConversions.length[designParams.units].unit} SCH {pipe.schedule} {material} (t ={" "}
            {pipe.t.toFixed(2)}):
          </div>

          {/* Indented formula */}
          <div style={{ marginTop: 8, marginLeft: 24 }}>
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
            <div>
              <span>tᵣ = (</span>
              <span style={fractionStyle}>
                <span style={numeratorStyle}>
                  {pressure}
                  {unitConversions.pressure[designParams.units].unit} × D
                </span>
                <span style={denominatorStyle}>
                  2(({allowableStress}
                  {unitConversions.pressure[designParams.units].unit})({e})({w}) + ({pressure}
                  {unitConversions.pressure[designParams.units].unit})({gamma}))
                </span>
              </span>
              <span>
                + {corrosionAllowance} {unitConversions.length[designParams.units].unit}) ×{" "}
              </span>
              <span style={fractionStyle}>
                <span style={numeratorStyle}>1</span>
                <span style={denominatorStyle}>(1 - {designParams.millTol})</span>
              </span>
            </div>
          </div>

          <div style={{ marginTop: 8, marginLeft: 24 }}>
            <div>
              <span>
                tᵣ = {pipe.tRequired.toFixed(2)}{" "}
                {unitConversions.length[designParams.units].unit}
              </span>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div>
              <span>t {'>'} tᵣ ∴ </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PdfPipeOutputs;
