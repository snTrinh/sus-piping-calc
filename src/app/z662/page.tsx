"use client";
import { Box, Typography, Container, Card } from "@mui/material";
// import FormulaDisplay from "@/components/z662/FormulaDisplay";
import DesignParameters from "@/components/z662/DesignParameters";

export default function Z662Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          pt: { xs: 4, md: 4 },
          px: { xs: 4, md: 4, lg: 0 },
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
          CSA Z662
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
        ></Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "stretch",
            mt: 2,
          }}
        >
          <Card
            sx={{
              width: { xs: "100%", md: 584 },
              minWidth: { xs: "auto", md: 450 },
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
              height: { xs: "100%", md: 353 },
              border: "1px solid #ddd",
            }}
            elevation={0}
          >
            <DesignParameters />
          </Card>

          <Card
            sx={{
              width: { xs: "100%", md: 584 },
              minWidth: { xs: "auto", md: 450 },
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
              height: 305,
              border: "1px solid #ddd",
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom>
              Formula
            </Typography>
            {/* <FormulaDisplay designParams={designParams} /> */}
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
