"use client";
import { useRef, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { DesignParameters, Units } from "@/types/units";
import PdfContent from "./PdfContent";

type PdfExportProps = {
  material: string;
  designParams: DesignParameters;
  pipes: {
    id: string;
    nps: string;
    od: string;
    schedule: string;
    tRequired: number;
    t: number;
  }[];
};

export default function PdfExport({
  material,
  pipes,
  designParams,
}: PdfExportProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const [drawingNumber, setDrawingNumber] = useState("");
  const [drawingRevision, setDrawingRevision] = useState("0");
  const [calculationRevision, setCalculationRevision] = useState("0");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

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

  const drawingInfo = {
    drawingNumber,
    drawingRevision,
    calculationRevision,
    date,
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
      {/* Group input fields into a flex container for consistent spacing */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="Drawing Number"
          value={drawingNumber}
          onChange={(e) => setDrawingNumber(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Drawing Revision Number"
          value={drawingRevision}
          onChange={(e) => setDrawingRevision(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Calculation Revision Number"
          value={calculationRevision}
          onChange={(e) => setCalculationRevision(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <PdfContent
        ref={printRef}
        drawingInfo={drawingInfo}
        designParams={designParams}
        material={material}
        pipes={pipes}
      />

      <Button variant="contained" onClick={handleDownloadPdf} sx={{ mt: 2 }}>
        Download PDF
      </Button>
    </Box>
  );
}
