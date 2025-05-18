import { Units } from "@/types/units";

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
  };
}
