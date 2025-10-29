import { Units } from "@/types/units";


export const materialsData = {
    Metric: {
      label: "Up to 40",
      columns: [40, 65, 100, 150, 200, 250, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600],
      materials: {
        A106B: [138000, 138000, 138000, 138000, 138000, 132000, 126000, 122000, 118000, 113000, 95100, 79500, 62600, 45000, 31700, 21400, 14200, 9400, 6890],
        A3336: [138000, 138000, 138000, 138000, 138000, 132000, 126000, 122000, 118000, 113000, 95100, 79500, 62600, 45000, 31700, 21400, 14200, 9400, 6890],
        A312TP316L: [138000, 138000, 138000, 138000, 134000, 125000, 119000, 116000, 114000, 112000, 111000, 110000, 109000, 108000, 107000, 106000, 105000, 97800, 80800],
        A312TP304L: [138000, 138000, 138000, 138000, 129000, 122000, 116000, 113000, 111000, 109000, 107000, 105000, 103000, 101000, 99100, 97300] // ends early
      }
    },
    Imperial: {
      label: "Up to 100",
      columns: [100, 200, 300, 400, 500, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100],
      materials: {
        A106B: [20000, 20000, 20000, 19900, 19000, 17900, 17300, 16700, 13900, 11400, 8700, 5900, 4000, 2500, 1600, 1000],
        A3336: [20000, 20000, 20000, 19900, 19000, 17900, 17300, 16700, 13900, 11400, 8700, 5900, 4000, 2500, 1600, 1000],
        A312TP316L: [20000, 20000, 20000, 19300, 18000, 17000, 16600, 16300, 16100, 15900, 15700, 15600, 15400, 15300, 15100, 12400],
        A312TP304L: [20000, 20000, 20000, 18600, 17500, 16600, 16200, 15800, 15500, 15200, 14900, 14600, 14300, 14000, 12400, 9800]
      }
    }
  };
  

  export type UnitCategory = keyof typeof materialsData;
  export type MaterialName = keyof (typeof materialsData)["Metric"]["materials"];
  

  export type MaterialTable = {
    label: string;
    columns: number[];
    materials: {
      [key: string]: number[];
    };
  };
  
  export type MaterialsDataType = {
    [key in UnitCategory]: MaterialTable;
  };


  export const getAllowableStressForTemp = (
    material: MaterialName,
    units: Units,
    temperature: number
  ): number => {
    const unitCategory: UnitCategory = units === Units.Metric ? "Metric" : "Imperial";
    const table = materialsData[unitCategory];
    const stressArray = table.materials[material];
    const columns = table.columns;
  
    // find the largest index where columnTemp <= designTemp
    let columnIndex = 0;
    for (let i = 0; i < columns.length; i++) {
      if (temperature >= columns[i]) {
        columnIndex = i;
      } else {
        break;
      }
    }
  
    return stressArray[columnIndex];
  };