// UnitsToggle.tsx
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
  // This hook is true for screens smaller than the 'md' breakpoint (default 960px).
  // This covers 'xs' (0-599px) and 'sm' (600-959px) ranges, where buttons should stretch.
  const shouldButtonsStretch = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ToggleButtonGroup
      value={units}
      exclusive
      onChange={onChange}
      sx={{
        // Ensure it behaves as a block-level flex container on xs and sm.
        display: { xs: 'flex', sm: 'flex' },

        // 100% width on xs screens (when stacked)
        width: { xs: "100%" },

        // *** CRITICAL FIX FOR 600PX AND UP (sm breakpoint) ***
        // Apply styles from the 'sm' breakpoint upwards
        [theme.breakpoints.up('sm')]: {
          // flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%.
          // This explicitly tells the ToggleButtonGroup to take up all remaining space
          // in its flex row, effectively overriding any 'width: auto' that clobbers it.
          flex: 1,
        },

        // On screens where buttons are compact (md+), align them to the right.
        // On screens where buttons stretch (xs and sm), this property won't have a visible effect
        // on horizontal button distribution as they are already filling the space.
        justifyContent: { md: 'flex-end' },

        // Remove or comment out debugging borders once verified
        // border: '1px solid red',
      }}
    >
      <ToggleButton
        value={Units.Imperial}
        sx={{
          flexGrow: shouldButtonsStretch ? 1 : 0,
          // border: '1px solid blue',
        }}
      >
        Imperial
      </ToggleButton>
      <ToggleButton
        value={Units.Metric}
        sx={{
          flexGrow: shouldButtonsStretch ? 1 : 0,
          // border: '1px solid green',
        }}
      >
        Metric
      </ToggleButton>
    </ToggleButtonGroup>
  );
}