"use client";
import React, { useMemo } from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";

import LabeledInput from "../../common/LabeledInput";
import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";
import {
  getAllowableStressForTemp,
  MaterialName,
  materialsData,
} from "@/utils/materialsData";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  selectSingleMaterial,
  setMaterial,
  updateAllowableStress,
  updateCorrosionAllowance,
  updatePipeSingleField,
  updatePressure,
  updateTemperature,
} from "@/state/singleSlice";
import { useSelector } from "react-redux";

interface DesignParametersProps {
  pipeId?: string; // optional: if not provided, use global parameters
}

export default function DesignParameters({ pipeId }: DesignParametersProps) {
  const dispatch = useAppDispatch();
  const materials = useMemo(() => {
    const metricMaterials = Object.keys(materialsData.Metric.materials);
    const imperialMaterials = Object.keys(materialsData.Imperial.materials);
    return [
      ...new Set([...metricMaterials, ...imperialMaterials]),
    ] as MaterialName[];
  }, []);

  const material = useAppSelector(selectSingleMaterial);
  const globalPressure = useAppSelector((state) => state.single.pressure);
  const globalTemperature = useAppSelector((state) => state.single.temperature);
  const units = useAppSelector((state) => state.unit.currentUnit);

  const { corrosionAllowance} = useSelector(
    (state: RootState) => state.single.global
  );
  const pipe = pipeId
    ? useAppSelector((state) => state.single.pipes.find((p) => p.id === pipeId))
    : undefined;

  const handlePressureChange = (value: number) => {
    dispatch(updatePressure(value));
  };

  const handleTemperatureChange = (value: number) => {
    dispatch(updateTemperature(value));
  };

  const handleMaterialChange = (value: string) => {
    dispatch(setMaterial(value as MaterialName));
  };

  const handleCAChange = (value: number) =>
    dispatch(updateCorrosionAllowance(value));

  const allowableStressFromMaterial = material
    ? getAllowableStressForTemp(material, units, globalTemperature)
    : 0;


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
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          select
          label="Material"
          value={material ?? ""}
          onChange={(e) => handleMaterialChange(e.target.value)}
          sx={{ minWidth: 200, flexGrow: 1 }}
          size="small"
        >
          {materials.map((mat) => (
            <MenuItem key={mat} value={mat}>
              {mat}
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
        <LabeledInput
          label="Design Pressure"
          symbol="P"
          unit={unitConversions.pressure[units].unit}
          value={globalPressure}
          onChange={handlePressureChange}
          sx={{ minWidth: 140, flex: 1 }}
        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[units].unit}
          value={globalTemperature}
          onChange={handleTemperatureChange}
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
          unit={unitConversions.length[units].unit}
          value={corrosionAllowance}
          onChange={handleCAChange}
          sx={{ minWidth: 140, flex: 1 }}
          precision={4}
        />

        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[units].unit}
          value={allowableStressFromMaterial}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flex: 1 }}
          precision={2}
        />
      </Box>
    </Box>
  );
}
