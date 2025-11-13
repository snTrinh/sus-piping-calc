"use client";
import React, { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import { Units } from "./../../types/units";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { setUnit } from "@/state/singleSlice";


export default function UnitsToggle() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const unit = useSelector((state: RootState) => state.single.currentUnit);

  const [shouldButtonsStretch, setShouldButtonsStretch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(theme.breakpoints.down("md"));
    setShouldButtonsStretch(mq.matches);

    const listener = (e: MediaQueryListEvent) => setShouldButtonsStretch(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);
  
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
