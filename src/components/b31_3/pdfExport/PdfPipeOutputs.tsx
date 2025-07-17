// src/components/pdfExport/PdfPipeOutputs.tsx

"use client";

import React from "react";
import { DesignParams, Units } from "@/types/units";
import pipeData from "@/data/transformed_pipeData.json"; // Assuming this is also your detailed pipe data (or same as pipeDimensions)
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import { useTheme } from "@mui/material/styles";
import { calculateTRequired, TRequiredParams } from "@/utils/pipeCalculations"; // Import the utility function and its types

// --- Corrected and Consolidated Type Definitions ---
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
  tRequired: number; // This is the calculated tRequired (in Imperial units from B31_3Calculator)
  t: number; // This is the actual pipe thickness
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
    designParams; // Destructure units here

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
        // Get conversion functions for the current display units
        const lengthConversion = unitConversions.length[units];
        const pressureConversion = unitConversions.pressure[units];

        // Determine the target NPS key for direct lookup in pipeData (e.g., "60" for Metric, "2" for Imperial)
        const targetNpsKey = units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;

        // --- Retrieve Outer Diameter and Schedule Thickness from JSON ---
        const currentUnitPipeDataEntry = typedPipeData[units]?.[targetNpsKey];
        const outerDiameterDisplay = currentUnitPipeDataEntry?.OD || 0;
        const displayedScheduleThickness = currentUnitPipeDataEntry?.schedules?.[pipe.schedule] ?? 0;

        // --- Prepare all values for formula calculation and display in the CURRENTLY SELECTED units ---
        // These values are already in the current display units, as per the LabeledInputConversion and DesignParameters behavior.
        const displayPressure = pressureConversion.to(pressure);
        const displayOuterDiameter = outerDiameterDisplay; // Already in current display units
        // Corrosion allowance for display in formula should be in current display units
        const displayCorrosionAllowance = corrosionAllowance;
        const displayAllowableStress = pressureConversion.to(allowableStress ?? 0);

        // --- Convert inputs to Imperial units for calculateTRequired utility function ---
        // These values (pressure, allowableStress, corrosionAllowance) are stored in designParams
        // in the CURRENTLY SELECTED DISPLAY UNIT.
        // We MUST convert them to Imperial base units (psi, inches) for calculateTRequired.
        const imperialPressure = pressureConversion.toImperial(pressure);
        const imperialAllowableStress = pressureConversion.toImperial(allowableStress ?? 0);
        const imperialCorrosionAllowance = lengthConversion.toImperial(corrosionAllowance);

        // outerDiameterDisplay comes from JSON and is in the CURRENT DISPLAY UNIT (mm or inches).
        // It also needs to be converted to Imperial inches for the calculation.
        const imperialOuterDiameter = lengthConversion.toImperial(outerDiameterDisplay);

        // Prepare parameters for the utility function
        const paramsForCalculation: TRequiredParams = {
          pressure: imperialPressure,
          outerDiameterInches: imperialOuterDiameter,
          allowableStress: imperialAllowableStress,
          e: e ?? 1, // Ensure E, W, gamma have default values if null/undefined
          w: w ?? 1,
          gamma: gamma ?? 1,
          corrosionAllowanceInches: imperialCorrosionAllowance,
          millTol: designParams.millTol ?? 0,
        };

        // --- Calculate tRequired using the utility function (result will be in Imperial inches) ---
        const tRequiredCalculatedImperial = calculateTRequired(paramsForCalculation);

        // --- Convert the calculated tRequired back to the current display units for rendering ---
        const tRequiredCalculatedDisplayUnits = lengthConversion.to(tRequiredCalculatedImperial);

        // For display in the formula, we still need the numerator and denominator values in the *current display units*
        // as if the calculation was done manually.
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
              <strong>Pipe {index + 1}</strong> — For NPS {pipe.nps} SCH{" "}
              {material} (D=
              {outerDiameterDisplay.toFixed(3)}
              {lengthConversion.unit}, t ={" "}
              {displayedScheduleThickness.toFixed(3)}
              {lengthConversion.unit}):
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
              {/* Initial Values (using values in the CURRENT display units for formula) */}
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
              {/* Calculated Values (using values in the CURRENT display units for formula) */}
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
