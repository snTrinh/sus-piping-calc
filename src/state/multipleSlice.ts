// multipleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { Pipe, PipeExt } from "@/types/pipe";
import { MaterialName, getAllowableStressForTemp } from "@/utils/materialsData";
import { calculateTRequired } from "@/utils/pipeCalculations";
import { E, GAMMA, MILL_TOL, W } from "@/constants/constants";
import { GlobalDesignParams } from "@/types/globalDesignParams";

import metricPipeData from "@/data/metricData.json";
import imperialPipeData from "@/data/imperialData.json";
import { Units } from "@/types/units";
import { npsToDnMap, PipeSchedule } from "@/utils/unitConversions";

type PipeDataEntry = {
  OD: number;
  schedules: Partial<Record<PipeSchedule, number>>;
};
type PipeData = Record<string, PipeDataEntry>;

const metricData: PipeData = metricPipeData;
const imperialData: PipeData = imperialPipeData;

interface MultipleState {
  global: GlobalDesignParams;
  currentUnit: Units;
  pipes: PipeExt[];
}

const initialState: MultipleState = {
  global: {
    corrosionAllowance: 0,
    e: E,
    w: W,
    gamma: GAMMA,
    millTol: MILL_TOL,
  },
  currentUnit: Units.Imperial,
  pipes: [],
};


function recalcPipe(pipe: PipeExt, units: Units, global: GlobalDesignParams) {
  if (units === Units.Metric) {
    pipe.dn = npsToDnMap[pipe.nps]; 
  }

  const pipeDataEntry =
    units === Units.Metric ? metricData[pipe.dn] : imperialData[pipe.nps];
  if (!pipeDataEntry) return;

  pipe.od = pipeDataEntry.OD;
  pipe.t = pipeDataEntry.schedules[pipe.schedule] ?? 0;
  pipe.allowableStress = getAllowableStressForTemp(pipe.material, units, pipe.temperature);
  pipe.tRequired = calculateTRequired({
    pressure: pipe.pressure,
    outerDiameter: pipe.od,
    allowableStress: pipe.allowableStress,
    e: global.e,
    w: global.w,
    gamma: global.gamma,
    corrosionAllowance: global.corrosionAllowance,
    millTol: global.millTol,
  });
}


const multipleSlice = createSlice({
  name: "multiplePressure",
  initialState,
  reducers: {
    setUnitMultiple(state, action: PayloadAction<Units>) {
      state.currentUnit = action.payload;
      state.pipes.forEach((pipe) => recalcPipe(pipe, state.currentUnit, state.global));
    },

    addPipe(state) {
      const pipe: PipeExt = {
        id: uuidv4(),
        nps: "4",
        dn: "DN 100",
        schedule: "40",
        od: 0,
        t: 0,
        tRequired: 0,
        allowableStress: 0,
        pressure: 1440,
        temperature: 100,
        material: "A106B",
      };
      recalcPipe(pipe, state.currentUnit, state.global);
      state.pipes.push(pipe);
    },

    removePipe(state, action: PayloadAction<string>) {
      state.pipes = state.pipes.filter((p) => p.id !== action.payload);
    },

    updatePipeField(
      state,
      action: PayloadAction<{ pipeId: string; key: keyof PipeExt; value: string | number }>
    ) {
      const { pipeId, key, value } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;
    
      if (["od", "t", "tRequired", "allowableStress", "pressure", "temperature"].includes(key)) {
        (pipe[key] as number) = value as number;
      } else if (["nps", "dn", "schedule", "id", "material"].includes(key)) {
        (pipe[key] as string | MaterialName) = value as string | MaterialName;
      }
    
      if (["nps", "schedule", "pressure", "temperature", "material"].includes(key)) {
        if (key === "nps" || key === "schedule") pipe.dn = npsToDnMap[pipe.nps];
        recalcPipe(pipe, state.currentUnit, state.global);
      }
    }
    ,


    updatePipeMaterial(
      state,
      action: PayloadAction<{ pipeId: string; material: MaterialName }>
    ) {
      const { pipeId, material } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;
      pipe.material = material;
      recalcPipe(pipe, state.currentUnit, state.global);
    },

    updatePipePressure(
      state,
      action: PayloadAction<{ pipeId: string; pressure: number }>
    ) {
      const { pipeId, pressure } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;
      pipe.pressure = pressure;
      recalcPipe(pipe, state.currentUnit, state.global);
    },

    updatePipeTemperature(
      state,
      action: PayloadAction<{ pipeId: string; temperature: number }>
    ) {
      const { pipeId, temperature } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;
      pipe.temperature = temperature;
      recalcPipe(pipe, state.currentUnit, state.global);
    },

    updateCorrosionAllowance(state, action: PayloadAction<number>) {
      state.global.corrosionAllowance = action.payload;
      state.pipes.forEach((pipe) => recalcPipe(pipe, state.currentUnit, state.global));
    },
  },
});

export const {
  setUnitMultiple,
  addPipe,
  removePipe,
  updatePipeField,
  updateCorrosionAllowance,
  updatePipeMaterial,
  updatePipePressure,
  updatePipeTemperature,
} = multipleSlice.actions;

export const selectMultiplePipes = (state: { multiple: MultipleState }) =>
  state.multiple.pipes;

export default multipleSlice.reducer;
