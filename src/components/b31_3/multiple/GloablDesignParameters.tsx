"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

import LabeledInputConversion from "../../common/LabeledInput";

import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type GlobalDesignParametersProps = {
  designParams: DesignParams;

  onUnitsChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
  onCAChange: (value: number) => void;
};

export default function GlobalDesignParameters({
  designParams,
  onCAChange,
}: GlobalDesignParametersProps) {
  const { corrosionAllowance } = designParams;

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
          unit={unitConversions.length[designParams.units].unit}
          value={corrosionAllowance}
          onChange={onCAChange}
          sx={{ minWidth: 140, flex: 1 }}
          precision={4}
        />
      </Box>
    </Box>
  );
}
