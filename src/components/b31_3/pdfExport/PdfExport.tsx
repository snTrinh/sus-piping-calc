"use client";
import { useRef, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { DesignParams, Units } from "@/types/units"; // Assuming DesignParams is from types/units
import PdfContent from "./PdfContent";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: string;
  tRequired: number;
  t: number;
};

type PdfExportProps = {
  material: string;
  designParams: DesignParams;
  pipes: Pipe[];
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

    if (typeof window !== 'undefined' && (window as any).html2pdf) {
      (window as any).html2pdf()
        .set({
          margin: 1,
          filename: "document.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {},
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(printRef.current)
        .save();
    } else {
      console.error("html2pdf.js not loaded.");
    }
  };

  const drawingInfo = {
    drawingNumber,
    drawingRevision,
    calculationRevision,
    date,
  };

  // Define the common responsive flex style for all inputs and the button
  const responsiveFlex = {
    xs: '1 1 100%', // Full width on extra-small screens (mobile)
    sm: '1 1 calc(50% - 8px)', // Two columns on small screens (tablet) - 8px accounts for half the 16px gap
    md: '1 1 0%', // Single row, distributed evenly on medium screens and up (desktop)
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
          flexWrap: "wrap", // Allows items to wrap to the next line if space is insufficient
          gap: 2, // Space between items (16px)
          mb: 2,
        }}
      >
        <TextField
          label="Drawing Number"
          value={drawingNumber}
          onChange={(e) => setDrawingNumber(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }} // Apply responsive flex
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Drawing Revision Number"
          value={drawingRevision}
          onChange={(e) => setDrawingRevision(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }} // Apply responsive flex
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Calculation Revision Number"
          value={calculationRevision}
          onChange={(e) => setCalculationRevision(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }} // Apply responsive flex
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }} // Apply responsive flex
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          startIcon={<ArrowCircleDownIcon/>}
          onClick={handleDownloadPdf}
          sx={{ flex: responsiveFlex, minWidth: 180 }} // Apply responsive flex
        >
          Download PDF
        </Button>
      </Box>

      <PdfContent
        ref={printRef}
        drawingInfo={drawingInfo}
        designParams={designParams}
        material={material}
        pipes={pipes}
      />
    </Box>
  );
}