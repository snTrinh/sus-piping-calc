

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


export const PIPE_SCHEDULE_ORDER: PipeSchedule[] = [
  "5s",
  "5",
  "10",
  "10s",
  "20",
  "30",
  "40S",
  "STD",
  "40",
  "60",
  "80S",
  "XH",
  "80",
  "100",
  "120",
  "140",
  "160",
  "XXH",
];

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
  "3-1/2": "102", 
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
  "26": "660", 
  "28": "711", 
  "30": "762", 
  "32": "813",
  "34": "864", 
  "36": "914", 
};

export const unitConversions = {
  pressure: {
    [Units.Imperial]: {
      to: (value: number) => value, 
      from: (value: number) => value, 
      toImperial: (value: number) => value,
      fromImperial: (value: number) => value, 
      unit: "psi",
    },
    [Units.Metric]: {
      to: (value: number) => value, 
      from: (value: number) => value,
      toImperial: (value: number) => value / 6.89476,
      fromImperial: (value: number) => value * 6.89476,
      unit: "kPa",
    },
  },
  length: {
    [Units.Imperial]: {
      to: (value: number) => value, 
      from: (value: number) => value, 
      toImperial: (value: number) => value, 
      fromImperial: (value: number) => value, 
      unit: "in",
    },
    [Units.Metric]: {
      to: (value: number) => value * 25.4, 
      from: (value: number) => value / 25.4, 
      toImperial: (value: number) => value / 25.4, 
      fromImperial: (value: number) => value * 25.4, 
      unit: "mm",
    },
  },
  temperature: {
    [Units.Imperial]: {
      to: (value: number) => value, 
      from: (value: number) => value, 
      toImperial: (value: number) => value,
      fromImperial: (value: number) => value,
      unit: "°F",
    },
    [Units.Metric]: {
      to: (value: number) => value,
      from: (value: number) => value, 
      toImperial: (value: number) => (value * 9) / 5 + 32, 
      fromImperial: (value: number) => ((value - 32) * 5) / 9, 
      unit: "°C",
    },
  },
  nps: {
    [Units.Imperial]: {
      to: (value: number) => value, 
      from: (value: number) => value,
      toImperial: (value: number) => value,
      fromImperial: (value: number) => value,
      unit: "in",
    },
    [Units.Metric]: {
      to: (value: number) => {
        
        return Number(npsToMmMap[value.toString()]) ?? NaN; 
      },
      from: (value: number) => {
        const inchNps = Object.entries(npsToMmMap).find(
          ([, mmString]) => mmString === value.toString() 
        );
        return inchNps ? Number(inchNps[0]) : NaN;
      },
      toImperial: (value: number) => {
        const inchNps = Object.entries(npsToMmMap).find(
          ([, mmString]) => mmString === value.toString() 
        );
        return inchNps ? Number(inchNps[0]) : NaN;
      },
      fromImperial: (value: number) => {
        return Number(npsToMmMap[value.toString()]) ?? NaN; 
      },
      unit: "mm",
    },
  },
};

interface ConvertDesignInputsProps {
  units: Units;
  temperature: number; 
  allowableStress: number | null; 
  corrosionAllowance: number; 
  pressure: number;
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
    
    temperatureDisplay: temperature,
    pressureDisplay: pressure,
    corrosionAllowanceDisplay: corrosionAllowance,
    
    allowableStressDisplay:
      allowableStress !== null
        ? unitConversions.pressure[units].fromImperial(allowableStress)
        : 0, 
  };
}
