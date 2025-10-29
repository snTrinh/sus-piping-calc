"use client";
import React from "react";
import { ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import { Units } from "./../../types/units";
import { selectUnit, setUnit } from "@/state/unitSlice";
import { useDispatch, useSelector } from "react-redux";


export default function UnitsToggle() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const unit = useSelector(selectUnit);
  const shouldButtonsStretch = useMediaQuery(theme.breakpoints.down('md'));
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnit: Units
  ) => {
    if (newUnit) dispatch(setUnit(newUnit));
  };


  return (
    <ToggleButtonGroup
      value={unit}
      exclusive
      onChange={handleChange}
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
