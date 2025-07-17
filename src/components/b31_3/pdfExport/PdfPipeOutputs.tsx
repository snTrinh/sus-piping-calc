// src/components/pdfExport/PdfPipeOutputs.tsx

"use client";

import React from "react";
import { DesignParams, Units } from "@/types/units";
import pipeDimensions from "@/data/transformed_pipeData.json"; // Assuming this is your detailed pipe data
import pipeData from "@/data/transformed_pipeData.json"; // Assuming this is also your detailed pipe data (or same as pipeDimensions)
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import { useTheme } from "@mui/material/styles";

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
const typedPipeDimensions: PipeDataJson = pipeDimensions; // If pipeDimensions is truly the same data as pipeData, you can just use typedPipeData for both lookups

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
        const displayPressure = pressureConversion.to(pressure); // Assuming 'pressure' is in a base unit, converted for display/calculation
        // Outer Diameter from JSON is already in the current unit system (mm for Metric, inches for Imperial).
        const displayOuterDiameter = outerDiameterDisplay;
        // CHANGE: Use corrosionAllowance directly. It's the raw input number, whose unit is implied by designParams.units.
        const displayCorrosionAllowance = corrosionAllowance;
        const displayAllowableStress = pressureConversion.to(allowableStress ?? 0); // Assuming 'allowableStress' is in a base unit, converted for display/calculation

        // --- Debugging Logs for t_r calculation ---
        console.log(`--- Pipe ${index + 1} t_r Calculation Debug ---`);
        console.log("Current Units:", units);
        console.log("displayPressure:", displayPressure, pressureConversion.unit);
        console.log("displayOuterDiameter:", displayOuterDiameter, lengthConversion.unit);
        console.log("displayCorrosionAllowance:", displayCorrosionAllowance, lengthConversion.unit); // This should now match the input
        console.log("displayAllowableStress:", displayAllowableStress, pressureConversion.unit);
        console.log("e:", e);
        console.log("w:", w);
        console.log("gamma:", gamma);
        console.log("designParams.millTol:", designParams.millTol);
        console.log("millTolDenominator (1 - millTol):", millTolDenominator);
        // --- End Debugging Logs ---

        // --- Perform t_r calculation using values in the CURRENTLY SELECTED units ---
        // This calculation will now directly use the values formatted for the current unit system.
        const numeratorCalculated = displayPressure * displayOuterDiameter;
        const denominatorCalculated =
          2 * (displayAllowableStress * (e ?? 1) * (w ?? 1) + displayPressure * (gamma ?? 1));

        const tRequiredCalculatedDisplayUnits =
          (numeratorCalculated / denominatorCalculated + displayCorrosionAllowance) *
          (1 / millTolDenominator);

        // --- Debugging Logs for t_r results ---
        console.log("numeratorCalculated:", numeratorCalculated.toFixed(3));
        console.log("denominatorCalculated:", denominatorCalculated.toFixed(3));
        console.log("tRequiredCalculatedDisplayUnits:", tRequiredCalculatedDisplayUnits.toFixed(3), lengthConversion.unit);
        // The tRequired from pipe object is stated to be calculated in B31_3Calculator (in Imperial).
        // Therefore, for comparison and display, we must convert it to the current display units.
        const displayedTRequiredFromPipeProp = lengthConversion.to(pipe.tRequired);
        console.log("displayedTRequiredFromPipeProp (from pipe prop, converted):", displayedTRequiredFromPipeProp.toFixed(3), lengthConversion.unit);
        console.log("---------------------------------------");
        // --- End Debugging Logs ---

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
                    {pressureConversion.unit})({e})(
                    {w}) + ({displayPressure.toFixed(2)}
                    {pressureConversion.unit})(
                    {gamma}))
                  </span>
                </span>
                <span>
                  + {displayCorrosionAllowance.toFixed(3)}
                  {lengthConversion.unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>
                    (1 - {designParams.millTol})
                  </span>
                </span>
              </div>
              {/* Calculated Values (using values in the CURRENT display units for formula) */}
              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>{numeratorCalculated.toFixed(2)}</span>
                  <span style={denominatorStyle}>{denominatorCalculated.toFixed(2)}</span>
                </span>
                <span>
                  {lengthConversion.unit} +{" "}
                  {displayCorrosionAllowance.toFixed(3)}
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
                  {tRequiredCalculatedDisplayUnits.toFixed(3)}{" "} {/* Use the newly calculated value */}
                  {lengthConversion.unit}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div>
                <span>
                  t {displayedScheduleThickness > tRequiredCalculatedDisplayUnits ? ">" : "<"}{" "} {/* Compare with the newly calculated value */}
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
