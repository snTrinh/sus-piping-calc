import React from "react";
import { DesignParameters, Units } from "@/types/units";
import pipeDimensions from "@/utils/transformed_pipeData.json";
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/utils/pipeData.json";
type Pipe = {
  od: string;
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
  const { pressure, corrosionAllowance, allowableStress, e, w, gamma } =
    designParams;

  const millTolDenominator = 1 - (designParams.millTol ?? 0);
  return (
    <>
      {pipes.map((pipe, index) => {
        const rawThickness =
          pipeDimensions["Imperial"][pipe.nps]?.schedules[pipe.schedule] ?? 0;

        const units = designParams.units as keyof typeof unitConversions.length;
        const thicknessConversion = unitConversions.length[units];

        const displayedScheduleThickness = thicknessConversion.to(rawThickness);
        const targetNps =
          units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;
        const outerDiameter =
          pipeData[units]?.columns?.find((col) => col.NPS === targetNps)?.OD ||
          0;

        const numerator = pressure * outerDiameter;
        const denominator =
          2 * (allowableStress * (e ?? 1) * (w ?? 1) + pressure * (gamma ?? 1));
        return (
          <div
            key={pipe.nps}
            style={{
              borderTop: "1px solid #ccc",
              paddingTop: 10,
              marginTop: 16,
            }}
          >
            <div style={valueStyle}>
              <strong>Pipe {index + 1}</strong> — For NPS {pipe.nps} SCH{" "}
              {pipe.schedule} {material} (D=
              {outerDiameter}
              {unitConversions.length[designParams.units].unit}, t ={" "}
              {displayedScheduleThickness.toFixed(3)}
              {unitConversions.length[designParams.units].unit}):
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
              {/* Initial Values */}
              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>
                    {pressure}
                    {unitConversions.pressure[designParams.units].unit} ×{" "}
                    {outerDiameter}
                    {unitConversions.length[designParams.units].unit}
                  </span>
                  <span style={denominatorStyle}>
                    2(({allowableStress}
                    {unitConversions.pressure[designParams.units].unit})({e})(
                    {w}) + ({pressure}
                    {unitConversions.pressure[designParams.units].unit})(
                    {gamma}))
                  </span>
                </span>
                <span>
                  + {corrosionAllowance}
                  {unitConversions.length[designParams.units].unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>
                    (1 - {designParams.millTol})
                  </span>
                </span>
              </div>
              {/* Calculated Values */}
              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>{numerator.toFixed(2)}</span>
                  <span style={denominatorStyle}>{denominator.toFixed(2)}</span>
                </span>
                <span>
                  {unitConversions.length[designParams.units].unit} +{" "}
                  {corrosionAllowance}
                  {unitConversions.length[designParams.units].unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>({millTolDenominator})</span>
                </span>
              </div>
            </div>

            <div style={{ marginTop: 8, marginLeft: 24 }}>
              <div>
                <span>
                  tᵣ = {numerator / denominator * 1/ millTolDenominator}{" "}
                  {unitConversions.length[designParams.units].unit}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div>
                <span>
                  t {displayedScheduleThickness > pipe.tRequired ? ">" : "<"} tᵣ
                  ∴{" "}
                  {displayedScheduleThickness > pipe.tRequired ? (
                    "Acceptable"
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Not Acceptable
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PdfPipeOutputs;
