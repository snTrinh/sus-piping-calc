"use client";
import { Box, Card, CardContent, TextField, Typography } from "@mui/material";


export default function ContactPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Contact
      </Typography>
      {/* Two-column layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 450, height: 250 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid #ddd",
            }}
            elevation={0}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Send us a message or give us feedback
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // Changed here
                    gap: 2,
                  }}
                >
                  <TextField
      
                    fullWidth
                    placeholder="Something sus?"
                    // value={x1}
                    // onChange={(e) => setX1(Number(e.target.value))}
                    size="small"
                  />
                </Box>
                {/* x - Responsive Flex Direction (for consistency/future expansion) */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // Changed here
                    gap: 2,
                  }}
                >
                  jhghjg
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Full-width row for PDF Export */}
      <Box sx={{ width: "100%" }}>{/* <PdfExport /> */}</Box>
    </Box>
  );
}
