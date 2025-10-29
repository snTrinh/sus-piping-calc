"use client";

import React from "react";
import { DesignParams, Units } from "@/types/units";
import pipeData from "@/data/transformed_pipeData.json";
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import { useTheme } from "@mui/material/styles";
import { calculateTRequired, TRequiredParams } from "@/utils/pipeCalculations";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { Pipe } from "@/types/pipe";

export type PipeDataEntry = {
  OD: number;
  schedules: Record<string, number>;
};

export type PipeDataJson = {
  Imperial: Record<string, PipeDataEntry>;
  Metric: Record<string, PipeDataEntry>;
};

const typedPipeData: PipeDataJson = pipeData;

type PdfPipeOutputsProps = {
  pipes: Pipe[];
  material: string;
  isMultiple: boolean;
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

const PdfPipeOutputs: React.FC<PdfPipeOutputsProps> = ({ pipes, material, isMultiple }) => {
  const theme = useTheme();
  const { pressure } = useSelector((state: RootState) => state.single);
  const { corrosionAllowance, gamma, e, w, millTol } =
    useSelector((state: RootState) => state.single.global);
  const units: Units = useSelector(
    (state: RootState) => state.unit.currentUnit
  );
  const millTolDenominator = 1 - millTol;

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
        const targetNpsKey =
          units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;
        const currentUnitPipeDataEntry = typedPipeData[units]?.[targetNpsKey];
        const outerDiameterDisplay = currentUnitPipeDataEntry?.OD || 0;
        const displayedScheduleThickness =
          currentUnitPipeDataEntry?.schedules?.[pipe.schedule];
        const displayPressure = pressureConversion.to(pressure);
        const displayOuterDiameter = outerDiameterDisplay;
        const displayCorrosionAllowance = corrosionAllowance;
        const displayAllowableStress = pressureConversion.to(pipe.allowableStress);
        const imperialPressure = pressureConversion.toImperial(pressure);
        const imperialAllowableStress = pressureConversion.toImperial(pipe.allowableStress);

        const imperialOuterDiameter =
          lengthConversion.toImperial(outerDiameterDisplay);
          console.log('P: ' +imperialPressure)
          console.log('OD: ' +imperialOuterDiameter)
          console.log('S: ' +imperialAllowableStress)
          console.log('t: ' +displayedScheduleThickness)
  
          console.log('cora: ' +corrosionAllowance)
        const paramsForCalculation: TRequiredParams = {
          pressure: imperialPressure,
          outerDiameterInches: imperialOuterDiameter,
          allowableStress: imperialAllowableStress,
          e,
          w,
          gamma,
          corrosionAllowanceInches: corrosionAllowance,
          millTol: millTol,
        };

        const tRequiredCalculatedImperial =
          calculateTRequired(paramsForCalculation);
        console.log('Treq: ' +tRequiredCalculatedImperial)
        const tRequiredCalculatedDisplayUnits = lengthConversion.to(
          tRequiredCalculatedImperial
        );
        const numeratorForDisplay = displayPressure * displayOuterDiameter;
        const denominatorForDisplay =
          2 * (displayAllowableStress * e * w + displayPressure * gamma);

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
              <strong>Pipe {index + 1}</strong> — For NPS {pipe.nps} SCH{" "}
              {pipe.schedule} {material} (D=
              {outerDiameterDisplay.toFixed(3)}
              {lengthConversion.unit}, t ={" "}
              {typeof displayedScheduleThickness === "number"
                ? displayedScheduleThickness.toFixed(3)
                : "N/A"}
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
                    {pressureConversion.unit})({e})(
                    {w}) + ({displayPressure.toFixed(2)}
                    {pressureConversion.unit})(
                    {gamma}))
                  </span>
                </span>
                <span>
                  + {displayCorrosionAllowance.toFixed(4)}
                  {lengthConversion.unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>
                    (1 - {millTol.toFixed(3)})
                  </span>
                </span>
              </div>

              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>
                    {numeratorForDisplay.toFixed(2)}
                  </span>
                  <span style={denominatorStyle}>
                    {denominatorForDisplay.toFixed(2)}
                  </span>
                </span>
                <span>
                  {lengthConversion.unit} +{" "}
                  {displayCorrosionAllowance.toFixed(4)}
                  {lengthConversion.unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>
                    ({millTolDenominator.toFixed(3)})
                  </span>
                </span>
              </div>
            </div>

            <div style={{ marginTop: 8, marginLeft: 24 }}>
              <div>
                <span>
                  tᵣ = {tRequiredCalculatedDisplayUnits.toFixed(3)}{" "}
                  {lengthConversion.unit}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div>
                <span>
                  t{" "}
                  {displayedScheduleThickness > tRequiredCalculatedDisplayUnits
                    ? ">"
                    : "<"}{" "}
                  tᵣ ∴{" "}
                  {displayedScheduleThickness >
                  tRequiredCalculatedDisplayUnits ? (
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
