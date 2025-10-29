"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

import LabeledInputConversion from "../../common/LabeledInput";
import { unitConversions } from "@/utils/unitConversions";
import { useDispatch, useSelector } from "react-redux";
import { updateCorrosionAllowance } from "@/state/multipleSlice";
import { RootState } from "@/state/store";


export default function GlobalDesignParameters() {
  const dispatch = useDispatch();
  const corrosionAllowance = useSelector((state: RootState) => state.multiple.global.corrosionAllowance);
  const units = useSelector((state: RootState) => state.unit.currentUnit);
  const handleCAChange = (value: number) => {
    dispatch(updateCorrosionAllowance(value));
  };
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
        <LabeledInputConversion
          label="Corrosion Allowance"
          symbol="CA"
          unit={unitConversions.length[units].unit}
          value={corrosionAllowance}
          onChange={handleCAChange}
          sx={{ minWidth: 140, flex: 1 }}
          precision={4}
        />
      </Box>
    </Box>
  );
}
