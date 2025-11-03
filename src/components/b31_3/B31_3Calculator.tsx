"use client";
import React, { useState } from "react";
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";

import SinglePressureTabContent from "./single/SinglePressureTabContent";
import MultiplePressuresTabContent from "./multiple/MultiplePressuresTabContent";
import UnitsToggle from "../common/UnitsToggle";

export default function B31_3Calculator() {
  const ENABLE_MULTIPLE_PRESSURES =
    process.env.NEXT_PUBLIC_ENABLE_MULTIPLE_PRESSURES === "true";
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ width: "100%", ml: 0 }}>
      <Container maxWidth="lg" disableGutters>
        <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
          B31.3 Pipe Thickness Calculator
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "flex-start", md: "space-between" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 2, md: 0 },
            mt: 2,
            mb: 2,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Single Pressure" />
            {ENABLE_MULTIPLE_PRESSURES && <Tab label="Multiple Pressures" />}
          </Tabs>
          <UnitsToggle />
        </Box>

        {tabIndex === 0 && <SinglePressureTabContent />}
        {tabIndex === 1 && <MultiplePressuresTabContent />}
      </Container>
    </Box>
  );
}
