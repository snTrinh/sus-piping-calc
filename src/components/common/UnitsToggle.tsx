"use client";
import React from "react";
import { ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import { Units } from "./../../types/units";

type UnitsToggleProps = {
  units: Units;
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
};

export default function UnitsToggle({ units, onChange }: UnitsToggleProps) {
  const theme = useTheme();

  const shouldButtonsStretch = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ToggleButtonGroup
      value={units}
      exclusive
      onChange={onChange}
      sx={{
        display: { xs: 'flex', sm: 'flex' },
        width: { xs: "100%" },
        [theme.breakpoints.up('sm')]: {
          flex: 1,
        },
        justifyContent: { md: 'flex-end' },
      }}
    >
      <ToggleButton
        value={Units.Imperial}
        sx={{
          flexGrow: shouldButtonsStretch ? 1 : 0,

        }}
      >
        Imperial
      </ToggleButton>
      <ToggleButton
        value={Units.Metric}
        sx={{
          flexGrow: shouldButtonsStretch ? 1 : 0,

        }}
      >
        Metric
      </ToggleButton>
    </ToggleButtonGroup>
  );
}