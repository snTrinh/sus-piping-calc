"use client";
import React, { useMemo } from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";

import LabeledInputConversion from "../../common/LabeledInput";
import LabeledInput from "../../common/LabeledInput";

import { unitConversions } from "@/utils/unitConversions";
import { MaterialName, materialsData } from "@/utils/materialsData";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import {
  updatePipeMaterial,
  updatePipePressure,
  updatePipeTemperature,
} from "@/state/multipleSlice";

type DesignParametersProps = {
  pipeId: string;
};

export default function DesignParameters({ pipeId }: DesignParametersProps) {
  const dispatch = useDispatch();
  const units = useSelector((state: RootState) => state.multiple.currentUnit);

  const pipeState = useSelector((state: RootState) =>
    state.multiple.pipes.find((p) => p.id === pipeId)
  );

  const materials = useMemo(() => {
    const metric = Object.keys(materialsData.Metric.materials);
    const imperial = Object.keys(materialsData.Imperial.materials);
    return Array.from(new Set([...metric, ...imperial])) as MaterialName[];
  }, []);

  const allowableStress = useMemo(() => {
    if (!pipeState || !pipeState.material) return 0;

    const { material, temperature } = pipeState;
    const data = units === "Metric" ? materialsData.Metric : materialsData.Imperial;
    const columnTemps = data.columns;
    const stresses = data.materials[material];

    let stress = stresses[0];
    for (let i = 0; i < columnTemps.length; i++) {
      if (temperature >= columnTemps[i]) stress = stresses[i];
      else break;
    }
    return stress;
  }, [pipeState, units]);

  if (!pipeState) return null;

  const { material, pressure, temperature } = pipeState;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Design Parameters
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) =>
            dispatch(updatePipeMaterial({ pipeId, material: e.target.value as MaterialName }))
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

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flexDirection: { xs: "column", sm: "row" } }}>
        <LabeledInputConversion
          label="Design Pressure"
          symbol="P"
          unit={unitConversions.pressure[units].unit}
          value={pressure}
          onChange={(val) => dispatch(updatePipePressure({ pipeId, pressure: val }))}
          sx={{ minWidth: 140, flex: 1 }}
        />
        <LabeledInputConversion
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[units].unit}
          value={temperature}
          onChange={(val) => dispatch(updatePipeTemperature({ pipeId, temperature: val }))}
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flexDirection: { xs: "column", sm: "row" } }}>
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
