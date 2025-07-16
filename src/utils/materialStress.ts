// src/utils/materialStressLookup.ts

import { materialsData, UnitCategory, MaterialName } from "./materialsData";
import { linearInterpolation } from "./interpolation";
import { unitConversions } from "./unitConversions"; // Import unitConversions and Units
import { Units } from "@/types/units";
/**
 * /**
 * Looks up and interpolates material stress values based on category, material, and temperature.
 * @param category The unit system ("Imperial" or "Metric") for the data table.
 * @param material The material name (e.g., "A106B").
 * @param temperature The temperature for which to find the stress value (always in the *current display unit*).
 * @param currentUnits The currently selected display unit from the UI (Units.Imperial or Units.Metric).
 * @returns The interpolated stress value as a number (in Imperial units), or null if data is not found or out of bounds.
 */
export function materialStress(
  category: UnitCategory,
  material: MaterialName,
  temperature: number, // This is the temperature in the CURRENT DISPLAY UNIT (F or C)
  currentUnits: Units // Pass the current display units from B31_3Calculator
): number | null {
  const table = materialsData[category];
  const columns = table.columns; // These columns are in the unit of the category (C for Metric, F for Imperial)
  const values = table.materials[material];

  if (!values) {
    console.warn(`Warning: Material '${material}' not found for category '${category}'. Returning null.`);
    return null;
  }

  if (columns.length === 0) {
    console.warn(`Warning: No temperature data available for category '${category}'. Returning null.`);
    return null;
  }

  // --- CORRECTED TEMPERATURE CONVERSION LOGIC (from display unit to table's unit) ---
  let temperatureForLookup: number;

  if (category === "Metric") {
    // If the data table is Metric (columns are in Celsius), convert input temperature to Celsius.
    if (currentUnits === Units.Imperial) {
      // Input is Fahrenheit, convert to Celsius
      temperatureForLookup = unitConversions.temperature[Units.Metric].fromImperial(temperature);
    } else {
      // Input is already Celsius, no conversion needed
      temperatureForLookup = temperature;
    }
  } else { // Imperial category
    // If the data table is Imperial (columns are in Fahrenheit), convert input temperature to Fahrenheit.
    if (currentUnits === Units.Metric) {
      // Input is Celsius, convert to Fahrenheit
      temperatureForLookup = unitConversions.temperature[Units.Imperial].toImperial(temperature);
    } else {
      // Input is already Fahrenheit, no conversion needed
      temperatureForLookup = temperature;
    }
  }
  // --- END CORRECTED TEMPERATURE CONVERSION LOGIC ---


  // Ensure the temperatureForLookup is a finite number
  if (!Number.isFinite(temperatureForLookup)) {
      console.warn(`Warning: Invalid temperature value for lookup: ${temperatureForLookup}. Returning null.`);
      return null;
  }

  if (temperatureForLookup < columns[0] || temperatureForLookup > columns[columns.length - 1]) {
    console.warn(`Warning: Temperature ${temperatureForLookup} is out of bounds for ${category} data. ` +
                 `Min: ${columns[0]}, Max: ${columns[columns.length - 1]}. Returning null.`);
    return null;
  }

  let lowerIndex = -1;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i] <= temperatureForLookup) {
      lowerIndex = i;
    } else {
      break;
    }
  }

  if (columns[lowerIndex] === temperatureForLookup) {
    // If exact match, return the value from the table
    // This value is in the table's unit (kPa for Metric, psi for Imperial)
    const exactStress = values[lowerIndex];
    // --- NEW: Convert exact stress to Imperial (PSI) before returning ---
    if (category === "Metric") {
      return unitConversions.pressure[Units.Metric].toImperial(exactStress);
    } else {
      return exactStress; // Already Imperial (PSI)
    }
  }

  if (lowerIndex === -1 || lowerIndex + 1 >= columns.length) {
    console.warn(`Warning: Could not find sufficient points for interpolation around temperature ${temperatureForLookup}. ` +
                 `Lower index: ${lowerIndex}, Columns length: ${columns.length}. Returning null.`);
    return null;
  }

  const x1 = columns[lowerIndex];
  const y1 = values[lowerIndex];
  const x2 = columns[lowerIndex + 1];
  const y2 = values[lowerIndex + 1];

  if (y1 === undefined || y2 === undefined) {
      console.warn(`Warning: Insufficient stress data for material '${material}' at temperature ${temperatureForLookup} for interpolation. ` +
                   `Points: x1=${x1}, y1=${y1}, x2=${x2}, y2=${y2}. Material data might end early. Returning null.`);
      return null;
  }

  const interpolatedStress = linearInterpolation(temperatureForLookup, x1, y1, x2, y2);

  // --- NEW: Convert interpolated stress to Imperial (PSI) before returning ---
  // The interpolated stress value is in the unit of the 'category' (kPa for Metric, psi for Imperial).
  // We need to convert it to Imperial (psi) before returning.
  if (category === "Metric") {
    return unitConversions.pressure[Units.Metric].toImperial(interpolatedStress);
  } else {
    return interpolatedStress; // Already Imperial (PSI)
  }
}
