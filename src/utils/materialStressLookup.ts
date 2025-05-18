import { materialsData } from "./../data/materialsData";

export function materialStressLookup(
  category: "Imperial" | "Metric",
  material: keyof (typeof materialsData)["Metric"]["materials"],
  temperature: number
): number | null {
  const table = materialsData[category];
  const index = table.columns.findIndex((temp) => temp === temperature);

  if (index === -1) return null;

  const values = table.materials[material];
  return values?.[index] ?? null;
}
