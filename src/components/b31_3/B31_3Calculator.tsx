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
            flexDirection: "row",
            justifyContent: "space-between" ,
            alignItems: "center" ,
            gap: 2,
            mt: 2,
            mb: 2,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              flexGrow: 1, 

            }}
          >
            <Tab label="Single Pressure" />
            {ENABLE_MULTIPLE_PRESSURES && <Tab label="Multiple Pressures" />}
          </Tabs>
          <Box 
          sx={{ flexShrink: 0 }}
          >
    <UnitsToggle />
  </Box>
        </Box>

        {tabIndex === 0 && <SinglePressureTabContent />}
        {tabIndex === 1 && <MultiplePressuresTabContent />}
      </Container>
    </Box>
  );
}
