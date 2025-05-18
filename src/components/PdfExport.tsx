"use client";
import html2pdf from "html2pdf.js";
import { useRef, useState } from "react";
import { Box, TextField, Button } from "@mui/material";

type PdfExportProps = {
  units: string;
};

export default function PdfExport({ units }: PdfExportProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const [drawingNumber, setDrawingNumber] = useState("");
  const [drawingRevision, setDrawingRevision] = useState("");
  const [calculationRevision, setCalculationRevision] = useState("");
  const [date, setDate] = useState("");

  const handleDownloadPdf = () => {
    if (!printRef.current) return;

    html2pdf()
      .set({
        margin: 1,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {},
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  };

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid #ddd",
      }}
    >
      <TextField
        label="Drawing Number"
        value={drawingNumber}
        onChange={(e) => setDrawingNumber(e.target.value)}
        size="small"
        sx={{ minWidth: 180, mb: 2 }}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Drawing Revision Number"
        value={drawingRevision}
        onChange={(e) => setDrawingRevision(e.target.value)}
        size="small"
        sx={{ minWidth: 180, mb: 2 }}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Calculation Revision Number"
        value={calculationRevision}
        onChange={(e) => setCalculationRevision(e.target.value)}
        size="small"
        sx={{ minWidth: 180, mb: 2 }}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        size="small"
        sx={{ minWidth: 180, mb: 2 }}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <div ref={printRef} style={{ padding: 20, maxWidth: 600 }}>
        Drawing Number: {drawingNumber} Revision: {drawingRevision} <br />
        Calulation Revision: {calculationRevision} <br />
        Date: {date}
        <br />
        Unit:{units}
        <br />
        Design Pressure:
        <br />
        Design Temperature:
        <br />
        Corrosion Allowance:
        <br />
        Temperature Coefficient, γ:
        <br />
        Maximum allowable Stress, S:
        <br />
      </div>

      <Button variant="contained" onClick={handleDownloadPdf} sx={{ mt: 2 }}>
        Download PDF
      </Button>
    </Box>
  );
}
