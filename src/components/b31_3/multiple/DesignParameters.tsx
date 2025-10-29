"use client";
import React, { useMemo } from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";

import LabeledInputConversion from "../../common/LabeledInput";

import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";
import { MaterialName, materialsData } from "@/utils/materialsData";
import LabeledInput from "../../common/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { updatePipeMaterialMultiple, updatePipePressureMultiple, updatePipeTemperatureMultiple } from "@/state/multipleSlice";

type DesignParametersProps = {
  pipeId: string; 
};

export default function DesignParameters({ pipeId }: DesignParametersProps) {
  const dispatch = useDispatch();

  // Redux state for this pipe
  const pipeState = useSelector((state: RootState) =>
    state.multiple.pipes.find((p) => p.pipe.id === pipeId)
  );
  const units = useSelector((state: RootState) => state.unit.currentUnit);
  if (!pipeState) return null;

  const { pipe, material, pressure, temperature } = pipeState;

  // Build material list from Metric + Imperial
  const materials = useMemo(() => {
    const metric = Object.keys(materialsData.Metric.materials);
    const imperial = Object.keys(materialsData.Imperial.materials);
    return Array.from(new Set([...metric, ...imperial])) as MaterialName[];
  }, []);

  // Compute allowable stress based on material and temperature
  const allowableStress = useMemo(() => {
    if (!material) return 0;

    const data =
      units === "Metric" ? materialsData.Metric : materialsData.Imperial;
    const columnTemps = data.columns;
    const stresses = data.materials[material];

    // Find the last column where temperature <= selected temp
    let stress = stresses[0];
    for (let i = 0; i < columnTemps.length; i++) {
      if (temperature >= columnTemps[i]) {
        stress = stresses[i];
      } else {
        break;
      }
    }
    return stress;
  }, [material, temperature, units]);

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
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) =>
            dispatch(updatePipeMaterialMultiple({ pipeId, material: e.target.value as MaterialName }))
          }
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
        <LabeledInputConversion
          label="Design Pressure"
          symbol="P"
          unit={unitConversions.pressure[units].unit}
          value={pressure}
          onChange={(val) => dispatch(updatePipePressureMultiple({ pipeId, pressure: val }))}
          sx={{ minWidth: 140, flex: 1 }}
        />

        <LabeledInputConversion
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[units].unit}
          value={temperature}
          onChange={(val) => dispatch(updatePipeTemperatureMultiple({ pipeId, temperature: val }))}
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
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[units].unit}
          value={allowableStress}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>
    </Box>
  );
}
