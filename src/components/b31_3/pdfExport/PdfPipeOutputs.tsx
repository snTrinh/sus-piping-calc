"use client";

import { RootState } from "@/state/store";
import { Pipe, PipeExt } from "@/types/pipe";
import { Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useSelector } from "react-redux";
import PdfDesignInputs, { DrawingInfo } from "./PdfDesignInputs";

export type PipeDataEntry = {
  OD: number;
  schedules: Record<string, number>;
};

export type PipeDataJson = {
  Imperial: Record<string, PipeDataEntry>;
  Metric: Record<string, PipeDataEntry>;
};

type PdfPipeOutputsProps = {
  pipes: Pipe[] | PipeExt[];
  isMultiple: boolean;
  drawingInfo: DrawingInfo;
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

const PdfPipeOutputs: React.FC<PdfPipeOutputsProps> = ({ drawingInfo, pipes, isMultiple }) => {
  const theme = useTheme();

    const singleUnit = useSelector(
      (state: RootState) => state.single.currentUnit
    );
    const multipleUnit = useSelector(
      (state: RootState) => state.multiple.currentUnit
    );
    const units: Units = isMultiple ? multipleUnit : singleUnit;

    const singleGlobal = useSelector((state: RootState) => state.single.global);
    const multipleGlobal = useSelector(
      (state: RootState) => state.multiple.global
    );
    const global = isMultiple ? multipleGlobal : singleGlobal;

    const singlePressure = useSelector(
      (state: RootState) => state.single.pressure
    );
    const singleTemperature = useSelector(
      (state: RootState) => state.single.temperature
    );

    const selectedMaterial = useSelector(
      (state: RootState) => state.single.selectedMaterial
    ); // ✅

    const millTolDenominator = 1 - global.millTol;

    const denominatorStyle: React.CSSProperties = {
      padding: "0 4px",
      marginTop: 2,
      textAlign: "center",
      borderTop: `1px solid ${theme.palette.text.primary}`,
    };

    return (
      <>
        <PdfDesignInputs drawingInfo={drawingInfo} />
        {pipes.map((pipe, index) => {
          // Determine pressure/temp based on mode
          const pipePressure =
            isMultiple && "pressure" in pipe
              ? pipe.pressure
              : singlePressure ?? 0;
          const pipeTemperature =
            isMultiple && "temperature" in pipe
              ? pipe.temperature
              : singleTemperature ?? 0;
          const pipeMaterial =
            isMultiple && "material" in pipe ? pipe.material : selectedMaterial;

          const lengthConversion = unitConversions.length[units];
          const pressureConversion = unitConversions.pressure[units];

          const outerDiameterDisplay = pipe.od;
          const displayedScheduleThickness = pipe.t;
          const allowableStress = pipe.allowableStress;
          const tRequired = pipe.tRequired;

          const numeratorForDisplay = pipePressure * outerDiameterDisplay;
          const denominatorForDisplay =
            2 *
            (allowableStress * global.e * global.w +
              pipePressure * global.gamma);

          return (
            <div key={pipe.id} style={{ marginTop: 16 }}>
              {/* DESIGN PARAMS */}
              {(!isMultiple && index === 0) || isMultiple ? (
                <div style={valueStyle}>
                  <div>
                    <div>
                      <strong>Design Pressure: </strong>
                      {pipePressure.toFixed(2)}
                      {pressureConversion.unit}
                    </div>
                    <div>
                      <strong>Temperature: </strong>
                      {pipeTemperature.toFixed(2)}
                      {units === Units.Metric ? "°C" : "°F"}
                    </div>
                    <div>
                      <strong>Corrosion Allowance: </strong>
                      {global.corrosionAllowance.toFixed(4)}
                      {lengthConversion.unit}
                    </div>
                    <div>
                      <strong>Maximum Allowable Stress: </strong>{allowableStress}
                    </div>
                    <div>
                      <strong>Temperature Coefficient, γ:</strong> {global.gamma}
                    </div>
                  </div>
                  
                </div>
              ) : null}

              <div>
                Seamless Pipe - 
                {units === Units.Metric ? (
                  <> DN {pipe.dn} </>
                ) : (
                  <> NPS {pipe.nps}&quot; </>
                )}
                SCH {pipe.schedule} {pipeMaterial} (D=
                {outerDiameterDisplay.toFixed(3)}
                {lengthConversion.unit}, t ={" "}
                {displayedScheduleThickness.toFixed(3)}
                {lengthConversion.unit}):
              </div>
              {/* tRequired fraction calculation */}
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
                      {pipePressure.toFixed(2)}
                      {pressureConversion.unit} ×{" "}
                      {outerDiameterDisplay.toFixed(3)}
                      {lengthConversion.unit}
                    </span>
                    <span style={denominatorStyle}>
                      2(({allowableStress.toFixed(2)}
                      {pressureConversion.unit})({global.e})({global.w}) + (
                      {pipePressure.toFixed(2)}
                      {pressureConversion.unit})({global.gamma}))
                    </span>
                  </span>
                  <span>
                    + {global.corrosionAllowance.toFixed(4)}
                    {lengthConversion.unit}) ×{" "}
                  </span>
                  <span style={fractionStyle}>
                    <span style={numeratorStyle}>1</span>
                    <span style={denominatorStyle}>
                      (1 - {global.millTol.toFixed(3)})
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
                    {global.corrosionAllowance.toFixed(4)}
                    {lengthConversion.unit}) ×{" "}
                  </span>
                  <span style={fractionStyle}>
                    <span style={numeratorStyle}>1</span>
                    <span style={denominatorStyle}>
                      ({millTolDenominator.toFixed(3)})
                    </span>
                  </span>
                </div>

                <div>
                  <span>
                    tᵣ = (
                    {(numeratorForDisplay / denominatorForDisplay).toFixed(4)}
                  </span>
                  <span>
                    {lengthConversion.unit} +{" "}
                    {global.corrosionAllowance.toFixed(4)}
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
                    tᵣ = {tRequired.toFixed(3)} {lengthConversion.unit}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <div>
                  <span>
                    t {displayedScheduleThickness > tRequired ? ">" : "<"} tᵣ ∴{" "}
                    <span
                      style={{
                        color:
                          displayedScheduleThickness > tRequired
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        fontWeight: "bold",
                      }}
                    >
                      {displayedScheduleThickness > tRequired
                        ? "Acceptable"
                        : "Not Acceptable"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }
;

export default PdfPipeOutputs;
