"use client";
import React from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";

import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions"; 
import csaZ662Data from '@/data/z662Data.json'; 
import LabeledInput from "../common/LabeledInput";

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
  designParams?: DesignParams; 
  onTemperatureChange?: (value: number) => void;
  onCAChange?: (value: number) => void; 
  onDesignPressureChange?: (value: number) => void; 
  onMillToleranceChange?: (value: number) => void; 
  onMinYieldStressChange?: (value: number) => void; 

  selectedFluidType?: string;
  onFluidTypeChange?: (value: string) => void; 
  selectedApplication?: string; 
  onApplicationChange?: (value: string) => void; 
  selectedClass?: string; 
  onClassChange?: (value: string) => void; 
  selectedPipeType?: string; 
  onPipeTypeChange?: (value: string) => void; 
  selectedTemperatureRange?: string; 
  onTemperatureRangeChange?: (value: string) => void;
  csaZ662Data?: CsaZ662Data; 
  uniqueApplications?: string[]; 
  minYieldStress?: number; 
};


export default function DesignParameters({
  designParams = { 
    units: Units.Imperial,
    pressure: 1000,
    temperature: 20,
    corrosionAllowance: 0.0625,
    allowableStress: 20000, 
    gamma: 0.4, 
    millTol: 0.125, 
    e: 1, 
    w: 1, 
  },
  onTemperatureChange = () => {},
  onCAChange = () => {},
  onDesignPressureChange = () => {},
  onMillToleranceChange = () => {},
  onMinYieldStressChange = () => {},
  selectedFluidType = typedCsaZ662Data.fluidTypes[0] || '', 
  onFluidTypeChange = () => {},
  selectedApplication = '',
  onApplicationChange = () => {},
  selectedClass = '',
  onClassChange = () => {},
  selectedPipeType = '',
  onPipeTypeChange = () => {},
  selectedTemperatureRange = '',
  onTemperatureRangeChange = () => {},
  csaZ662Data: propsCsaZ662Data = typedCsaZ662Data, 
  uniqueApplications: propsUniqueApplications, 
  minYieldStress = 35000, 
}: DesignParametersProps) {
  const { pressure, temperature, corrosionAllowance, units, millTol } =
    designParams;
  const pressureUnitDetails = unitConversions.pressure[units];
  const temperatureUnitDetails = unitConversions.temperature[units];
  const lengthUnitDetails = unitConversions.length[units];
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




      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, 
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
          flexDirection: { xs: "column", sm: "row" }, 
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
          conversionFactorFromBase={1} 
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
          flexDirection: { xs: "column", sm: "row" }, 
        }}
      >
         
        <LabeledInput
          label="Minimum Yield Stress"
          symbol="S"
          unit={pressureUnitDetails.unit} 
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
          flexDirection: { xs: "column", sm: "row" }, 
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
          flexDirection: { xs: "column", sm: "row" }, 
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