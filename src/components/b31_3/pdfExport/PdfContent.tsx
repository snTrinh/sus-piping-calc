import React, { forwardRef } from "react";
import { DesignParams} from "@/types/units";
import PdfDesignInputs, { DrawingInfo } from "./PdfDesignInputs";
import PdfPipeOutputs from "./PdfPipeOutputs";
import { useTheme } from "@mui/material/styles"; // Import useTheme

// Corrected Pipe type to include 'id'
export type Pipe = {
  id: string; // Added 'id' to match PdfPipeOutputs' Pipe type
  nps: string;
  od: string;
  schedule: string;
  tRequired: number;
  t: number;
};

export type PdfContentProps = {
  drawingInfo: DrawingInfo;
  designParams: DesignParams;
  material: string;
  pipes: Pipe[]; // Now using the corrected Pipe type
};

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(
  ({ drawingInfo, designParams, material, pipes }, ref) => {
    const theme = useTheme(); // Access the Material-UI theme

    return (
      <div
        ref={ref}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 14,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: theme.palette.text.primary, // Use the primary text color from your theme
        }}
      >
        <PdfDesignInputs
          drawingInfo={drawingInfo}
          designParams={designParams}
        />

        <PdfPipeOutputs
          pipes={pipes}
          designParams={designParams}
          material={material}
        />
      </div>
    );
  }
);

PdfContent.displayName = "PdfContent";
export default PdfContent;
