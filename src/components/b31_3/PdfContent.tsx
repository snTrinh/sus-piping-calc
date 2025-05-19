import React, { forwardRef } from "react";
import { DesignParameters, Units } from "@/types/units";
import PdfDesignInputs from "./PdfDesignInputs";
import PdfPipeOutputs from "./PdfPipeOutputs";

export type PdfContentProps = {
  drawingNumber: string;
  drawingRevision: string;
  calculationRevision: string;
  date: string;
  designParams: DesignParameters;
  material: string;
  pipes: {
    id: string;
    nps: string;
    schedule: string;
    tRequired: number;
    t: number;
  }[];
};

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(
  (
    {
      drawingNumber,
      drawingRevision,
      calculationRevision,
      date,
      designParams,
      material,
      pipes,
    },
    ref
  ) => {
    const {
      units,
      pressure,
      corrosionAllowance,
      allowableStress,
      e,
      w,
      gamma,
    } = designParams;
    const labelStyle: React.CSSProperties = {
      fontWeight: "bold",
      marginRight: 5,
    };
    const valueStyle: React.CSSProperties = {
      marginBottom: 8,
      display: "block",
    };
    const fractionStyle: React.CSSProperties = {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: 12,
      lineHeight: 1,
      marginLeft: 4,
      marginRight: 4,
    };
    const numeratorStyle: React.CSSProperties = {
      borderBottom: "1px solid #000",
      padding: "0 4px",
      textAlign: "center",
    };
    const denominatorStyle: React.CSSProperties = {
      padding: "0 4px",
      marginTop: 2,
      textAlign: "center",
    };

    return (
      <div
        ref={ref}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 14,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#333",
        }}
      >
        <PdfDesignInputs
          drawingNumber={drawingNumber}
          drawingRevision={drawingRevision}
          calculationRevision={calculationRevision}
          date={date}
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
