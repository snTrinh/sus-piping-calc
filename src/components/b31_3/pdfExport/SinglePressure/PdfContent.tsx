"use client";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Box, useTheme } from "@mui/material";
import PdfDesignInputs, { DrawingInfo } from "./PdfDesignInputs";
import PdfPipeOutputs from "./PdfPipeOutputs";
import { Pipe } from "@/types/pipe";

export type PdfContentProps = {
  drawingInfo: DrawingInfo;
  material: string;
  pipes: Pipe[];
  isMultiple?: boolean;
};

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(
  ({ drawingInfo, material, pipes, isMultiple = false }, ref) => {
    const theme = useTheme();
    const globalDesign = useSelector((state: RootState) => state.single.global);


    const pipeList = (isMultiple ? pipes : [pipes[0]]).filter(Boolean);


    return (
      <div
        ref={ref}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 14,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: theme.palette.text.primary,
        }}
      >
        {pipeList.map((pipe, index) => {
          const designParams = {
            pressure: pipe.pressure ?? 0,
            temperature: pipe.temperature ?? 0,
            allowableStress: pipe.allowableStress ?? 0,
            corrosionAllowance: globalDesign.corrosionAllowance,
            gamma: globalDesign.gamma,
            e: globalDesign.e,
            w: globalDesign.w,
            millTol: globalDesign.millTol,
          };

          return (
            <PdfDesignInputs
              key={pipe.id}
              drawingInfo={{
                ...drawingInfo,
                calculationRevision:
                  drawingInfo.calculationRevision +
                  (isMultiple ? `.${index + 1}` : ""),
              }}
              designParamsSingle={designParams} 
            />
          );
        })}

        <PdfPipeOutputs
          pipes={pipes}
          material={material}
          isMultiple={isMultiple}
        />
      </div>
    );
  }
);

PdfContent.displayName = "PdfContent";
export default PdfContent;
