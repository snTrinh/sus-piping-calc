"use client";

import React from "react";
import { DesignParams, Units } from "@/types/units";
import pipeData from "@/data/transformed_pipeData.json"; 
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import { useTheme } from "@mui/material/styles";
import { calculateTRequired, TRequiredParams } from "@/utils/pipeCalculations"; 


export type PipeDataEntry = {
  OD: number;
  schedules: Record<string, number>;
};

export type PipeDataJson = {
  Imperial: Record<string, PipeDataEntry>;
  Metric: Record<string, PipeDataEntry>;
};

const typedPipeData: PipeDataJson = pipeData;

type Pipe = {
  id: string;
  od: string;
  nps: string;
  schedule: string;
  tRequired: number;
  t: number; 
};

type PdfPipeOutputsProps = {
  pipes: Pipe[];
  designParams: DesignParams;
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

const PdfPipeOutputs: React.FC<PdfPipeOutputsProps> = ({
  pipes,
  material,
  designParams,
}) => {
  const theme = useTheme();

  const { pressure, corrosionAllowance, allowableStress, e, w, gamma, units } =
    designParams;

  const millTolDenominator = 1 - (designParams.millTol ?? 0);

  const denominatorStyle: React.CSSProperties = {
    padding: "0 4px",
    marginTop: 2,
    textAlign: "center",
    borderTop: `1px solid ${theme.palette.text.primary}`,
  };

  return (
    <>
      {pipes.map((pipe, index) => {

        const lengthConversion = unitConversions.length[units];
        const pressureConversion = unitConversions.pressure[units];
        const targetNpsKey = units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;
        const currentUnitPipeDataEntry = typedPipeData[units]?.[targetNpsKey];
        const outerDiameterDisplay = currentUnitPipeDataEntry?.OD || 0;
        const displayedScheduleThickness = currentUnitPipeDataEntry?.schedules?.[pipe.schedule] ?? 0;
        const displayPressure = pressureConversion.to(pressure);
        const displayOuterDiameter = outerDiameterDisplay; 
        const displayCorrosionAllowance = corrosionAllowance;
        const displayAllowableStress = pressureConversion.to(allowableStress ?? 0);
        const imperialPressure = pressureConversion.toImperial(pressure);
        const imperialAllowableStress = pressureConversion.toImperial(allowableStress ?? 0);
        const imperialCorrosionAllowance = lengthConversion.toImperial(corrosionAllowance);
        const imperialOuterDiameter = lengthConversion.toImperial(outerDiameterDisplay);

        const paramsForCalculation: TRequiredParams = {
          pressure: imperialPressure,
          outerDiameterInches: imperialOuterDiameter,
          allowableStress: imperialAllowableStress,
          e: e ?? 1, 
          w: w ?? 1,
          gamma: gamma ?? 1,
          corrosionAllowanceInches: imperialCorrosionAllowance,
          millTol: designParams.millTol ?? 0,
        };


        const tRequiredCalculatedImperial = calculateTRequired(paramsForCalculation);

        const tRequiredCalculatedDisplayUnits = lengthConversion.to(tRequiredCalculatedImperial);
        const numeratorForDisplay = displayPressure * displayOuterDiameter;
        const denominatorForDisplay =
          2 * (displayAllowableStress * (e ?? 1) * (w ?? 1) + displayPressure * (gamma ?? 1));

        return (
          <div
            key={pipe.id}
            style={{
              borderTop: `1px solid ${theme.palette.divider}`,
              paddingTop: 10,
              marginTop: 16,
            }}
          >
            <div style={valueStyle}>
              <strong>Pipe {index + 1}</strong> — For NPS {pipe.nps} SCH{" "}{pipe.schedule}{" "}
              {material} (D=
              {outerDiameterDisplay.toFixed(3)}
              {lengthConversion.unit}, t ={" "}
              {displayedScheduleThickness.toFixed(3)}
              {lengthConversion.unit}):
            </div>

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
                    {displayPressure.toFixed(2)}
                    {pressureConversion.unit} ×{" "}
                    {displayOuterDiameter.toFixed(3)}
                    {lengthConversion.unit}
                  </span>
                  <span style={denominatorStyle}>
                    2(({displayAllowableStress.toFixed(2)}
                    {pressureConversion.unit})({e ?? 1})(
                    {w ?? 1}) + ({displayPressure.toFixed(2)}
                    {pressureConversion.unit})(
                    {gamma ?? 1}))
                  </span>
                </span>
                <span>
                  + {displayCorrosionAllowance.toFixed(4)}
                  {lengthConversion.unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>
                    (1 - {(designParams.millTol ?? 0).toFixed(3)})
                  </span>
                </span>
              </div>
 
              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>{numeratorForDisplay.toFixed(2)}</span>
                  <span style={denominatorStyle}>{denominatorForDisplay.toFixed(2)}</span>
                </span>
                <span>
                  {lengthConversion.unit} +{" "}
                  {displayCorrosionAllowance.toFixed(4)}
                  {lengthConversion.unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>({millTolDenominator.toFixed(3)})</span>
                </span>
              </div>
            </div>

            <div style={{ marginTop: 8, marginLeft: 24 }}>
              <div>
                <span>
                  tᵣ ={" "}
                  {tRequiredCalculatedDisplayUnits.toFixed(3)}{" "}
                  {lengthConversion.unit}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div>
                <span>
                  t {displayedScheduleThickness > tRequiredCalculatedDisplayUnits ? ">" : "<"}{" "}
                  tᵣ ∴{" "}
                  {displayedScheduleThickness > tRequiredCalculatedDisplayUnits ? (
                    <span
                      style={{
                        color: theme.palette.success.main,
                        fontWeight: "bold",
                      }}
                    >
                      Acceptable
                    </span>
                  ) : (
                    <span
                      style={{
                        color: theme.palette.error.main,
                        fontWeight: "bold",
                      }}
                    >
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
