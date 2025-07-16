"use client";

import React from "react";
import { DesignParams, Units } from "@/types/units";
import pipeDimensions from "@/data/transformed_pipeData.json"; // Assuming this path is correct
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/data/pipeData.json"; // Assuming this path is correct
import { useTheme } from "@mui/material/styles"; // Import useTheme

type Pipe = {
  id: string; // Ensure pipe has an ID for unique keys
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

// These styles can remain outside if they don't depend on the theme,
// or be moved inside if they need theme-specific adjustments.
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
  const theme = useTheme(); // Access the Material-UI theme

  const { pressure, corrosionAllowance, allowableStress, e, w, gamma } =
    designParams;

  const millTolDenominator = 1 - (designParams.millTol ?? 0);

  // Define denominatorStyle inside the component to use theme colors
  const denominatorStyle: React.CSSProperties = {
    padding: "0 4px",
    marginTop: 2,
    textAlign: "center",
    borderTop: `1px solid ${theme.palette.text.primary}`, // Use theme's primary text color for the horizontal line
  };

  return (
    <>
      {pipes.map((pipe, index) => {
        // Get raw thickness from pipeData.json (it's in Imperial inches)
        // @ts-expect-error this is required
        const rawThicknessImperial = pipeDimensions["Imperial"][pipe.nps]?.schedules[pipe.schedule] ?? 0;

        const units = designParams.units; // Current display units
        const lengthConversion = unitConversions.length[units];
        const pressureConversion = unitConversions.pressure[units];

        // Convert rawThickness (Imperial) to display units for 't'
        const displayedScheduleThickness = lengthConversion.to(rawThicknessImperial);

        // Get outer diameter in display units
        const targetNps =
          units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;
        const outerDiameterDisplay =
          pipeData[units]?.columns?.find((col) => col.NPS === targetNps)?.OD ||
          0;

        // --- Convert design parameters to Imperial for formula display consistency ---
        // pressure from designParams is in display units, convert to Imperial for formula
        const pressureImperial = pressureConversion.toImperial(pressure);
        // outerDiameter from pipeData is in display units, convert to Imperial for formula
        const outerDiameterImperial = unitConversions.length[units].toImperial(outerDiameterDisplay);
        // corrosionAllowance from designParams is in display units, convert to Imperial for formula
        const corrosionAllowanceImperial = lengthConversion.toImperial(corrosionAllowance);
        // allowableStress is already in Imperial (PSI) from B31_3Calculator

        // Calculate numerator and denominator using Imperial units for formula display
        const numeratorImperial = pressureImperial * outerDiameterImperial;
        const denominatorImperial =
          2 * ((allowableStress ?? 0) * (e ?? 1) * (w ?? 1) + pressureImperial * (gamma ?? 1));

        // The tRequired from pipe object is already calculated in B31_3Calculator (in Imperial)
        // Convert pipe.tRequired (Imperial) to display units for showing in the final line and comparison
        const displayedTRequired = lengthConversion.to(pipe.tRequired);

        return (
          <div
            key={pipe.id} // Use pipe.id for key, as nps might not be unique
            style={{
              borderTop: `1px solid ${theme.palette.divider}`, // Use theme's divider color for the section border
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
              {/* Initial Values (using Imperial values for calculation display in formula) */}
              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>
                    {pressureImperial.toFixed(2)}
                    {unitConversions.pressure[Units.Imperial].unit} ×{" "}
                    {outerDiameterImperial.toFixed(3)}
                    {unitConversions.length[Units.Imperial].unit}
                  </span>
                  <span style={denominatorStyle}>
                    2(({(allowableStress ?? 0).toFixed(2)}
                    {unitConversions.pressure[Units.Imperial].unit})({e})(
                    {w}) + ({pressureImperial.toFixed(2)}
                    {unitConversions.pressure[Units.Imperial].unit})(
                    {gamma}))
                  </span>
                </span>
                <span>
                  + {corrosionAllowanceImperial.toFixed(3)}
                  {unitConversions.length[Units.Imperial].unit}) ×{" "}
                </span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>1</span>
                  <span style={denominatorStyle}>
                    (1 - {designParams.millTol})
                  </span>
                </span>
              </div>
              {/* Calculated Values (using Imperial values for calculation display in formula) */}
              <div>
                <span>tᵣ = (</span>
                <span style={fractionStyle}>
                  <span style={numeratorStyle}>{numeratorImperial.toFixed(2)}</span>
                  <span style={denominatorStyle}>{denominatorImperial.toFixed(2)}</span>
                </span>
                <span>
                  {unitConversions.length[Units.Imperial].unit} +{" "}
                  {corrosionAllowanceImperial.toFixed(3)}
                  {unitConversions.length[Units.Imperial].unit}) ×{" "}
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
                  {displayedTRequired.toFixed(3)}{" "} {/* Use the converted tRequired from pipe object */}
                  {lengthConversion.unit}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div>
                <span>
                  t {displayedScheduleThickness > displayedTRequired ? ">" : "<"}{" "}
                  tᵣ ∴{" "}
                  {displayedScheduleThickness > displayedTRequired ? (
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
