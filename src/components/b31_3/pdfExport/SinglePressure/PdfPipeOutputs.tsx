"use client";

import React from "react";
import { Units } from "@/types/units";
import pipeData from "@/data/transformed_pipeData.json";
import { npsToDnMap, unitConversions } from "@/utils/unitConversions";
import { useTheme } from "@mui/material/styles";
import { calculateTRequired, TRequiredParams } from "@/utils/pipeCalculations";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { Pipe } from "@/types/pipe";
import { getAllowableStressForTemp } from "@/utils/materialsData";

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

const PdfPipeOutputs: React.FC<PdfPipeOutputsProps> = ({ pipes }) => {
  const theme = useTheme();

  const { temperature, selectedMaterial, pressure } = useSelector(
    (state: RootState) => state.single
  );
  const { corrosionAllowance, gamma, e, w, millTol } = useSelector(
    (state: RootState) => state.single.global
  );
  const units: Units = useSelector(
    (state: RootState) => state.single.currentUnit
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

        const outerDiameterDisplay = pipe.od;
        const displayedScheduleThickness = pipe.t;
        const allowableStress = pipe.allowableStress;
        const tRequired = pipe.tRequired;

        const numeratorForDisplay = pressure * outerDiameterDisplay;
        const denominatorForDisplay =
          2 * (allowableStress * e * w + pressure * gamma);

        return (
          <div
            key={pipe.id}
            style={{
              marginTop: 16,
            }}
          >
            <div style={valueStyle}>
              <strong>Pipe {index + 1} — For </strong>
              {units === Units.Metric ? (
                <>DN {pipe.dn} </>
              ) : (
                <>NPS {pipe.nps}" </>
              )}
              SCH {pipe.schedule} {selectedMaterial} (D=
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
                    {pressure.toFixed(2)}
                    {pressureConversion.unit} ×{" "}
                    {outerDiameterDisplay.toFixed(3)}
                    {lengthConversion.unit}
                  </span>
                  <span style={denominatorStyle}>
                    2(({allowableStress.toFixed(2)}
                    {pressureConversion.unit})({e})(
                    {w}) + ({pressure.toFixed(2)}
                    {pressureConversion.unit})(
                    {gamma}))
                  </span>
                </span>
                <span>
                  + {corrosionAllowance.toFixed(4)}
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
                  {lengthConversion.unit} + {corrosionAllowance.toFixed(4)}
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
                  {lengthConversion.unit} + {corrosionAllowance.toFixed(4)}
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
                  {displayedScheduleThickness > tRequired ? (
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
