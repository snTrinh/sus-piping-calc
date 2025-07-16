// src/utils/unitConversions.ts

import { Units } from "@/types/units";


  export type PipeSchedule =
  | "5s" | "5" | "10" | "10s" | "20" | "30" | "40S" | "STD" | "40"
  | "60" | "80S" | "XH" | "80" | "100" | "120" | "140" | "160" | "XXH";
  
  export type ThicknessData = {
    [key in PipeSchedule]: (number | null)[];
  };
  
  export const npsToMmMap: Record<string, number> = {
    "1/8": 10,
    "1/4": 13,
    "3/8": 17,
    "1/2": 21,
    "3/4": 27,
    "1": 33,
    "1 1/4": 42,
    "1 1/2": 48,
    "2": 60,
    "2 1/2": 73,
    "3": 89,
    "4": 114,
    "5": 141,
    "6": 168,
    "8": 219,
    "10": 273,
    "12": 324,
    "14": 356,
    "16": 406,
    "18": 457,
    "20": 508,
    "24": 610,
  };
  

export const unitConversions = {
  pressure: {
    [Units.Imperial]: {
      to: (value: number) => value, // psi to psi (display)
      from: (value: number) => value, // psi to psi (internal)
      toImperial: (value: number) => value, // From current display unit to Imperial (psi)
      fromImperial: (value: number) => value, // From Imperial (psi) to current display unit
      unit: "psi",
    },
    [Units.Metric]: {
      to: (value: number) => value, // kPa to kPa (display) - value is already in kPa
      from: (value: number) => value, // kPa to kPa (internal)
      toImperial: (value: number) => value / 6.89476, // From kPa to Imperial (psi)
      fromImperial: (value: number) => value * 6.89476, // From Imperial (psi) to kPa
      unit: "kPa",
    },
  },
  length: {
    [Units.Imperial]: {
      to: (value: number) => value, // inch to inch (display)
      from: (value: number) => value, // inch to inch (internal)
      toImperial: (value: number) => value, // From current display unit to Imperial (inch)
      fromImperial: (value: number) => value, // From Imperial (inch) to current display unit
      unit: "in",
    },
    [Units.Metric]: {
      to: (value: number) => value, // mm to mm (display) - value is already in mm
      from: (value: number) => value, // mm to mm (internal)
      toImperial: (value: number) => value / 25.4, // From mm to Imperial (inch)
      fromImperial: (value: number) => value * 25.4, // From Imperial (inch) to mm
      unit: "mm",
    },
  },
  temperature: {
    [Units.Imperial]: {
      to: (value: number) => value, // F to F (display)
      from: (value: number) => value, // F to F (internal)
      toImperial: (value: number) => value, // From current display unit to Imperial (F)
      fromImperial: (value: number) => value, // From Imperial (F) to C
      unit: "°F",
    },
    [Units.Metric]: {
      to: (value: number) => value, // C to C (display) - value is already in C
      from: (value: number) => value, // C to C (internal)
      toImperial: (value: number) => (value * 9) / 5 + 32, // From C to Imperial (F)
      fromImperial: (value: number) => ((value - 32) * 5) / 9, // From Imperial (F) to C
      unit: "°C",
    },
  },
  nps: {
    [Units.Imperial]: {
      to: (value: number) => value, // NPS inch to inch (no change)
      from: (value: number) => value,
      toImperial: (value: number) => value,
      fromImperial: (value: number) => value,
      unit: "in",
    },
    [Units.Metric]: {
      to: (value: number) => {
        // Convert inch NPS to approximate metric NPS in mm
        return npsToMmMap[value] ?? NaN; // Return NaN if not found
      },
      from: (value: number) => {
        // Convert metric mm NPS back to inch NPS (approximate)
        // Find key by value (reverse lookup)
        const inchNps = Object.entries(npsToMmMap).find(
          ([, mm]) => mm === value
        );
        return inchNps ? Number(inchNps[0]) : NaN;
      },
      toImperial: (value: number) => {
        // Convert metric mm NPS to inch NPS (approximate)
        const inchNps = Object.entries(npsToMmMap).find(
          ([, mm]) => mm === value
        );
        return inchNps ? Number(inchNps[0]) : NaN;
      },
      fromImperial: (value: number) => {
        // Convert inch NPS to approximate metric NPS in mm
        return npsToMmMap[value] ?? NaN;
      },
      unit: "mm",
    },
  },
};

// Assuming DesignParams type exists in '@/types/units'
interface ConvertDesignInputsProps {
  units: Units;
  temperature: number; // Stored in current display unit
  allowableStress: number | null; // Stored in Imperial internally, converted for display
  corrosionAllowance: number; // Stored in current display unit
  pressure: number; // Stored in current display unit
}

interface ConvertedDesignInputs {
  temperatureDisplay: number;
  allowableStressDisplay: number;
  corrosionAllowanceDisplay: number;
  pressureDisplay: number;
}

export function convertDesignInputs({
  units,
  temperature,
  allowableStress,
  corrosionAllowance,
  pressure,
}: ConvertDesignInputsProps): ConvertedDesignInputs {
  return {
    // These are now just passing through, as the state is already in display units
    temperatureDisplay: temperature,
    pressureDisplay: pressure,
    corrosionAllowanceDisplay: corrosionAllowance,
    // Allowable stress is still calculated (internally Imperial) and converted for display
    allowableStressDisplay: allowableStress !== null
      ? unitConversions.pressure[units].fromImperial(allowableStress)
      : 0, // Default to 0 for display if null
  };
}