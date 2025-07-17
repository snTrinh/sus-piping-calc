// src/utils/unitConversions.ts

import { Units } from "@/types/units";

export type PipeSchedule =
  | "5s"
  | "5"
  | "10"
  | "10s"
  | "20"
  | "30"
  | "40S"
  | "STD"
  | "40"
  | "60"
  | "80S"
  | "XH"
  | "80"
  | "100"
  | "120"
  | "140"
  | "160"
  | "XXH";

export type ThicknessData = {
  [key in PipeSchedule]: (number | null)[];
};

export const npsToMmMap: Record<string, string> = {
  "1/8": "10",
  "1/4": "13",
  "3/8": "17",
  "1/2": "21",
  "3/4": "26",
  "1": "33",
  "1-1/4": "42",
  "1-1/2": "48",
  "2": "60",
  "2-1/2": "73",
  "3": "88",
  "3-1/2": "102", // Assuming 3-1/2" maps to 102 (4")
  "4": "114",
  "5": "141",
  "6": "168",
  "8": "219",
  "10": "273",
  "12": "323",
  "14": "355",
  "16": "406",
  "18": "457",
  "20": "508",
  "24": "610",
  "26": "660", // Assuming 26" maps to 660mm
  "28": "711", // Assuming 28" maps to 711mm
  "30": "762", // Assuming 30" maps to 762mm
  "32": "813", // Assuming 32" maps to 813mm
  "34": "864", // Assuming 34" maps to 864mm
  "36": "914", // Assuming 36" maps to 914mm
  // Add any other specific mappings required based on your pipe data and common NPS/DN conversions
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
      to: (value: number) => value * 25.4, // CORRECTED: Convert inches (internal) to mm (display)
      from: (value: number) => value / 25.4, // CORRECTED: Convert mm (display) to inches (internal)
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
        // Convert inch NPS (number) to approximate metric NPS (string)
        // Ensure the key is a string before looking up in npsToMmMap
        return Number(npsToMmMap[value.toString()]) ?? NaN; // Convert result back to number
      },
      from: (value: number) => {
        // Convert metric mm NPS (number) back to inch NPS (approximate)
        // Find key by value (reverse lookup) - ensure comparison is string to string
        const inchNps = Object.entries(npsToMmMap).find(
          ([, mmString]) => mmString === value.toString() // Convert number to string for comparison
        );
        return inchNps ? Number(inchNps[0]) : NaN;
      },
      toImperial: (value: number) => {
        // Convert metric mm NPS (number) to inch NPS (approximate)
        // Ensure comparison is string to string
        const inchNps = Object.entries(npsToMmMap).find(
          ([, mmString]) => mmString === value.toString() // Convert number to string for comparison
        );
        return inchNps ? Number(inchNps[0]) : NaN;
      },
      fromImperial: (value: number) => {
        // Convert inch NPS (number) to approximate metric NPS in mm
        // Ensure the key is a string before looking up in npsToMmMap
        return Number(npsToMmMap[value.toString()]) ?? NaN; // Convert result back to number
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
    allowableStressDisplay:
      allowableStress !== null
        ? unitConversions.pressure[units].fromImperial(allowableStress)
        : 0, // Default to 0 for display if null
  };
}
