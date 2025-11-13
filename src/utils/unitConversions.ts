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

export type PipeDN =
  | "6"
  | "8"
  | "10"
  | "15"
  | "20"
  | "25"
  | "32"
  | "40"
  | "50"
  | "65"
  | "80"
  | "90"
  | "100"
  | "125"
  | "150"
  | "200"
  | "250"
  | "300"
  | "350"
  | "400"
  | "450"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "1000"
  | "1100"
  | "1200";

export const npsToDnMap: Record<string, PipeDN> = {
  "1/8": "6",
  "1/4": "8",
  "3/8": "10",
  "1/2": "15",
  "3/4": "20",
  "1": "25",
  "1-1/4": "32",
  "1-1/2": "40",
  "2": "50",
  "2-1/2": "65",
  "3": "80",
  "3-1/2": "90",
  "4": "100",
  "5": "125",
  "6": "150",
  "8": "200",
  "10": "250",
  "12": "300",
  "14": "350",
  "16": "400",
  "18": "450",
  "20": "500",
  "24": "600",
  "28": "700",
  "32": "800",
  "36": "900",
  "40": "1000",
  "44": "1100",
  "48": "1200",
};

export type ScheduleThicknesses = {
  [key in PipeSchedule]?: number;
};

export interface PipeSizeData {
  OD: number;
  schedules: ScheduleThicknesses;
}

export type PipeData = Record<PipeDN, PipeSizeData>;

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
      to: (value: number) =>
        npsToDnMap[value.toString()]
          ? Number(npsToDnMap[value.toString()])
          : NaN,
      from: (value: number) => {
        const entry = Object.entries(npsToDnMap).find(
          ([_, mm]) => mm === value.toString()
        );
        return entry ? Number(entry[0]) : NaN;
      },
      toImperial: (value: number) => {
        const entry = Object.entries(npsToDnMap).find(
          ([_, mm]) => mm === value.toString()
        );
        return entry ? Number(entry[0]) : NaN;
      },
      fromImperial: (value: number) =>
        npsToDnMap[value.toString()]
          ? Number(npsToDnMap[value.toString()])
          : NaN,
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
