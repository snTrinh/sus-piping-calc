

import { materialsData, UnitCategory, MaterialName } from "./materialsData";
import { linearInterpolation } from "./interpolation";
import { unitConversions } from "./unitConversions"; 
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
  temperature: number, 
  currentUnits: Units 
): number | null {
  const table = materialsData[category];
  const columns = table.columns; 
  const values = table.materials[material];

  if (!values) {
    console.warn(`Warning: Material '${material}' not found for category '${category}'. Returning null.`);
    return null;
  }

  if (columns.length === 0) {
    console.warn(`Warning: No temperature data available for category '${category}'. Returning null.`);
    return null;
  }

  let temperatureForLookup: number;

  if (category === "Metric") {
   
    if (currentUnits === Units.Imperial) {
      
      temperatureForLookup = unitConversions.temperature[Units.Metric].fromImperial(temperature);
    } else {
     
      temperatureForLookup = temperature;
    }
  } else { 
   
    if (currentUnits === Units.Metric) {
      
      temperatureForLookup = unitConversions.temperature[Units.Imperial].toImperial(temperature);
    } else {
      
      temperatureForLookup = temperature;
    }
  }
  
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
    
    const exactStress = values[lowerIndex];
    if (category === "Metric") {
      return unitConversions.pressure[Units.Metric].toImperial(exactStress);
    } else {
      return exactStress; 
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

  if (category === "Metric") {
    return unitConversions.pressure[Units.Metric].toImperial(interpolatedStress);
  } else {
    return interpolatedStress; 
  }
}
