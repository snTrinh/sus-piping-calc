"use client";
import React from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";

import { DesignParams, Units } from "@/types/units"; // Import DesignParams and Units
import { unitConversions } from "@/utils/unitConversions"; // Import unitConversions
import csaZ662Data from '@/data/z662Data.json'; // Import the JSON data directly
import LabeledInput from "../common/LabeledInput";

// Define types for the imported CSA Z662 data (re-defining for clarity in this component)
interface ApplicationClassFactor {
  Application: string;
  'Class 1': number;
  'Class 2': number;
  'Class 3': number;
  'Class 4': number;
}

interface PipeJointFactor {
  'Pipe Type': string;
  'Joint Factor': number;
}

interface TemperatureFactor {
  Temperature: string;
  'Temperature Factor': number;
}

interface CsaZ662Data {
  fluidTypes: string[];
  applicationClassFactors: ApplicationClassFactor[];
  pipeJointFactors: PipeJointFactor[];
  temperatureFactors: TemperatureFactor[];
}

const typedCsaZ662Data: CsaZ662Data = csaZ662Data as CsaZ662Data;


type DesignParametersProps = {
  designParams?: DesignParams; // Make optional
  onTemperatureChange?: (value: number) => void; // Make optional
  onCAChange?: (value: number) => void; // Make optional
  onDesignPressureChange?: (value: number) => void; // Make optional
  onMillToleranceChange?: (value: number) => void; // Make optional
  onMinYieldStressChange?: (value: number) => void; // Make optional

  selectedFluidType?: string; // Make optional
  onFluidTypeChange?: (value: string) => void; // Make optional
  selectedApplication?: string; // Make optional
  onApplicationChange?: (value: string) => void; // Make optional
  selectedClass?: string; // Make optional
  onClassChange?: (value: string) => void; // Make optional
  selectedPipeType?: string; // Make optional
  onPipeTypeChange?: (value: string) => void; // Make optional
  selectedTemperatureRange?: string; // Make optional
  onTemperatureRangeChange?: (value: string) => void; // Make optional
  csaZ662Data?: CsaZ662Data; // Make optional, will use direct import if not provided
  uniqueApplications?: string[]; // Make optional, will derive if not provided
  minYieldStress?: number; // Make optional
};


export default function DesignParameters({
  designParams = { // Default DesignParams object
    units: Units.Imperial,
    pressure: 1000,
    temperature: 20,
    corrosionAllowance: 0.0625,
    allowableStress: 20000, // Default to null for calculated value
    gamma: 0.4, // Default value
    millTol: 0.125, // Default value
    e: 1, // Default value
    w: 1, // Default value
  },
  onTemperatureChange = () => {},
  onCAChange = () => {},
  onDesignPressureChange = () => {},
  onMillToleranceChange = () => {},
  onMinYieldStressChange = () => {},
  selectedFluidType = typedCsaZ662Data.fluidTypes[0] || '', // Default to first fluid type or empty
  onFluidTypeChange = () => {},
  selectedApplication = '',
  onApplicationChange = () => {},
  selectedClass = '',
  onClassChange = () => {},
  selectedPipeType = '',
  onPipeTypeChange = () => {},
  selectedTemperatureRange = '',
  onTemperatureRangeChange = () => {},
  csaZ662Data: propsCsaZ662Data = typedCsaZ662Data, // Use imported data as default
  uniqueApplications: propsUniqueApplications, // Use prop if provided, else derive
  minYieldStress = 35000, // Default minimum yield stress in psi
}: DesignParametersProps) {
  // Destructure `units` from designParams to access unit conversion details
  const { pressure, temperature, corrosionAllowance, units, millTol } =
    designParams;

  // Get conversion details for each type of unit based on the current `units` system
  const pressureUnitDetails = unitConversions.pressure[units];
  const temperatureUnitDetails = unitConversions.temperature[units];
  const lengthUnitDetails = unitConversions.length[units];

  // Derive uniqueApplications internally if not provided via props
  const currentUniqueApplications = propsUniqueApplications || Array.from(
    new Set(
      (selectedFluidType
        ? propsCsaZ662Data.applicationClassFactors.filter((entry) =>
            entry.Application.startsWith(selectedFluidType)
          )
        : propsCsaZ662Data.applicationClassFactors
      ).map(app => app.Application)
    )
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Design Parameters
      </Typography>



      {/* Existing Design Parameters (now connected to parent state) */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Two columns on sm and up
        }}
      >
        <LabeledInput
          label="Design Pressure"
          symbol="P"
          unit={pressureUnitDetails.unit}
          value={pressure}
          onChange={onDesignPressureChange}
          conversionFactorFromBase={pressureUnitDetails.to(1)}
          conversionFactorToBase={pressureUnitDetails.from(1)}
          sx={{ minWidth: 140, flex: 1 }}

        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={temperatureUnitDetails.unit}
          value={temperature}
          onChange={onTemperatureChange}
          conversionFactorFromBase={temperatureUnitDetails.to(1)}
          conversionFactorToBase={temperatureUnitDetails.from(1)}
          sx={{ minWidth: 140, flex: 1 }}

        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Two columns on sm and up
        }}
      >
        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={lengthUnitDetails.unit}
          value={lengthUnitDetails.to(corrosionAllowance)}
          onChange={onCAChange}
          conversionFactorFromBase={lengthUnitDetails.to(1)}
          conversionFactorToBase={lengthUnitDetails.from(1)}
          sx={{ minWidth: 140, flex: 1 }}

        />

        <LabeledInput
          label="Mill Tolerance"
          symbol="%"
          unit=""
          value={millTol}
          onChange={onMillToleranceChange}
          conversionFactorFromBase={1} // Percentage is 1:1
          conversionFactorToBase={1}
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Two columns on sm and up
        }}
      >
         
        <LabeledInput
          label="Minimum Yield Stress"
          symbol="S"
          unit={pressureUnitDetails.unit} // Assuming yield stress unit is same as pressure
          value={minYieldStress}
          onChange={onMinYieldStressChange}
          conversionFactorFromBase={pressureUnitDetails.to(1)}
          conversionFactorToBase={pressureUnitDetails.from(1)}
          sx={{ minWidth: 140, flex: 1 }}
        />

<TextField
          select
          label="Fluid Type"
          value={selectedFluidType}
          onChange={(e) => onFluidTypeChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
          InputLabelProps={{ shrink: true }}
        >
          {propsCsaZ662Data.fluidTypes.map((fluid) => (
            <MenuItem key={fluid} value={fluid}>
              {fluid}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Two columns on sm and up
        }}
      >
         
         <TextField
          select
          label="Application"
          value={selectedApplication}
          onChange={(e) => onApplicationChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
          InputLabelProps={{ shrink: true }}
          disabled={!selectedFluidType}
        >
          {currentUniqueApplications.map((app) => (
            <MenuItem key={app} value={app}>
              {app}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Class Location Number"
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
          InputLabelProps={{ shrink: true }}
          disabled={!selectedApplication}
        >
          {['Class 1', 'Class 2', 'Class 3', 'Class 4'].map((cls) => (
            <MenuItem key={cls} value={cls}>
              {cls}
            </MenuItem>
          ))}
        </TextField>
      </Box>



      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Two columns on sm and up
        }}
      >
         
         <TextField
          select
          label="Pipe Type"
          value={selectedPipeType}
          onChange={(e) => onPipeTypeChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
          InputLabelProps={{ shrink: true }}
        >
          {propsCsaZ662Data.pipeJointFactors.map((entry) => (
            <MenuItem key={entry['Pipe Type']} value={entry['Pipe Type']}>
              {entry['Pipe Type']}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Temperature Range"
          value={selectedTemperatureRange}
          onChange={(e) => onTemperatureRangeChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
          InputLabelProps={{ shrink: true }}
        >
          {propsCsaZ662Data.temperatureFactors.map((entry) => (
            <MenuItem key={entry.Temperature} value={entry.Temperature}>
              {entry.Temperature}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}
