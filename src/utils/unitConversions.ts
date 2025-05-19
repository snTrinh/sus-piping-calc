import { Units } from "@/types/units";

export const unitLabels = {
    [Units.Metric]: {
      pressure: "kPa",
      temperature: "°C",
      length: "mm",

    },
    [Units.Imperial]: {
      pressure: "psi",
      temperature: "°F",
      length: "in",
    },
  };

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

  export const mmToNpsMap: Record<number, string> = Object.fromEntries(
    Object.entries(npsToMmMap).map(([key, value]) => [value, key])
  );
  

export const unitConversions = {
  pressure: {
    [Units.Imperial]: {
      to: (value: number) => value, // psi to psi
      from: (value: number) => value,
      unit: "psi",
    },
    [Units.Metric]: {
      to: (value: number) => value * 6.89476, // psi to kPa
      from: (value: number) => value / 6.89476,
      unit: "kPa",
    },
  },
  thickness: {
    [Units.Imperial]: {
      to: (value: number) => value, // inch to inch
      from: (value: number) => value,
      unit: "in",
    },
    [Units.Metric]: {
      to: (value: number) => value * 25.4, // inch to mm
      from: (value: number) => value / 25.4,
      unit: "mm",
    },
  },
  temperature: {
    [Units.Imperial]: {
      to: (value: number) => value, // F to F
      from: (value: number) => value,
      unit: "°F",
    },
    [Units.Metric]: {
      to: (value: number) => ((value - 32) * 5) / 9, // F to C
      from: (value: number) => (value * 9) / 5 + 32,
      unit: "°C",
    },
  },
  nps: {
    [Units.Imperial]: {
      to: (value: number) => value, // NPS inch to inch (no change)
      from: (value: number) => value,
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
      unit: "mm",
    },
  },
};

export function convertDesignInputs({
  units,
  temperature,
  stress,
  ca,
  designPressure,
}: {
  units: Units;
  temperature: number; // Stored in F internally
  stress: number;
  ca: number;
  designPressure: number; // Stored in psi internally
}) {
  return {
    temperatureDisplay: Number(
      unitConversions.temperature[units].to(temperature).toFixed(2)
    ),
    stressDisplay: Number(
      unitConversions.pressure[units].to(stress).toFixed(2)
    ),
    caDisplay: Number(
      unitConversions.thickness[units].to(ca).toFixed(2)
    ),
    pressureDisplay: Number(
      unitConversions.pressure[units].to(designPressure).toFixed(2)
    ),
    pressureUnit: unitConversions.pressure[units].unit,
    caUnit: unitConversions.thickness[units].unit,
    stressUnit: unitConversions.pressure[units].unit,
    tempUnit: unitConversions.temperature[units].unit,
    diameterUnit: unitConversions.thickness[units].unit,
  };
}
