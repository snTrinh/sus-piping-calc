// singleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllowableStressForTemp, MaterialName } from "../utils/materialsData";
import { npsToDnMap, PipeSchedule } from "@/utils/unitConversions";
import { RootState } from "./store";
import { Pipe } from "@/types/pipe";
import { calculateTRequired } from "@/utils/pipeCalculations";
import metricPipeData from "@/data/metricData.json";
import imperialPipeData from "@/data/imperialData.json";
import { E, GAMMA, MILL_TOL, W } from "@/constants/constants";
import { GlobalDesignParams } from "@/types/globalDesignParams";
import { Units } from "@/types/units";

interface SingleState {
  global: GlobalDesignParams;
  pressure: number;
  temperature: number;
  selectedMaterial: MaterialName;
  currentUnit: Units;
  pipes: Pipe[];
}

type PipeDataEntry = {
  OD: number;
  schedules: Partial<Record<PipeSchedule, number>>;
};

type PipeData = Record<string, PipeDataEntry>;

const metricData: PipeData = metricPipeData;
const imperialData: PipeData = imperialPipeData;

const initialState: SingleState = {
  global: {
    corrosionAllowance: 0,
    e: E,
    w: W,
    gamma: GAMMA,
    millTol: MILL_TOL,
  },
  pressure: 1440,
  temperature: 100,
  selectedMaterial: "A106B",
  currentUnit: Units.Imperial,
  pipes: [],
};

// --- Helper to update OD, schedule thickness, tRequired, allowableStress ---
function recalcPipe(
  pipe: Pipe,
  units: Units,
  global: GlobalDesignParams,
  pressure: number,
  material: MaterialName,
  temperature: number
) {
  // Get pipe data in current unit
  let pipeDataEntry;
  if (units === Units.Metric) {
    pipeDataEntry = metricData[pipe.dn]; // DN key for metric
  } else {
    pipeDataEntry = imperialData[pipe.nps]; // NPS key for imperial
  }
  if (!pipeDataEntry) return;

  // OD and schedule thickness
  pipe.od = pipeDataEntry.OD; 
  pipe.t = pipeDataEntry.schedules[pipe.schedule] ?? 0;
  pipe.allowableStress = getAllowableStressForTemp(material, units, temperature);

  console.log(pressure);
  console.log(pipe.od);
  console.log(pipe.allowableStress); // incorrect
  console.log(global.e);
  console.log(global.w);
  console.log(global.gamma);
  console.log(global.corrosionAllowance);
  console.log(global.millTol);
  // Recalculate required thickness
  pipe.tRequired = calculateTRequired({
    pressure,
    outerDiameter: pipe.od,
    allowableStress: pipe.allowableStress,
    e: global.e,
    w: global.w,
    gamma: global.gamma,
    corrosionAllowance: global.corrosionAllowance,
    millTol: global.millTol,
  });
}


const singleSlice = createSlice({
  name: "singlePressure",
  initialState,
  reducers: {
    // --- Switch units globally ---
    setUnit(state, action: PayloadAction<Units>) {
      const newUnit = action.payload;
      state.currentUnit = newUnit;

      state.pipes.forEach((pipe) => {
        recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);

      });
    },

    // --- Add a new pipe ---
    addPipeSingle(
      state,
      action: PayloadAction<{ id: string; nps: string; schedule: PipeSchedule }>
    ) {
      const { id, nps, schedule } = action.payload;
      const pipe: Pipe = {
        id,
        nps,
        dn: npsToDnMap[nps],
        schedule,
        od: 0,
        t: 0,
        tRequired: 0,
        allowableStress: 20000, // default
      };
      recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);

      state.pipes.push(pipe);
    },

    // --- Update pipe field and recalc if needed ---
    updatePipeSingleField(
      state,
      action: PayloadAction<{ pipeId: string; key: keyof Pipe; value: string | number }>
    ) {
      const { pipeId, key, value } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;

      if (["od", "t", "tRequired", "allowableStress"].includes(key)) {
        (pipe[key] as number) = value as number;
      } else if (["nps", "dn", "schedule", "id"].includes(key)) {
        (pipe[key] as string) = value as string;
      }

      // Recalc OD/t/tRequired if NPS, Schedule or Units change
      if (key === "nps" || key === "schedule") {
        pipe.dn = npsToDnMap[pipe.nps];
        recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);

      }
    },

    // --- Remove pipe ---
    removePipe(state, action: PayloadAction<string>) {
      state.pipes = state.pipes.filter((p) => p.id !== action.payload);
    },

    // --- Update pressure globally and recalc ---
    updatePressure(state, action: PayloadAction<number>) {
      state.pressure = action.payload;
      state.pipes.forEach((pipe) => recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature)    );
    },

    updateTemperature(state, action: PayloadAction<number>) {
      state.temperature = action.payload;
    },

    setMaterial(state, action: PayloadAction<MaterialName>) {
      state.selectedMaterial = action.payload;
    },

    updateCorrosionAllowance(state, action: PayloadAction<number>) {
      state.global.corrosionAllowance = action.payload;
      state.pipes.forEach((pipe) => recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature));

    },

    updateAllowableStress(
      state,
      action: PayloadAction<{ pipeId: string; allowableStress: number }>
    ) {
      const { pipeId, allowableStress } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;
      pipe.allowableStress = allowableStress;
      recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);

    },
  },
});

export const {
  setUnit,
  addPipeSingle,
  removePipe,
  updatePipeSingleField,
  updatePressure,
  updateTemperature,
  setMaterial,
  updateCorrosionAllowance,
  updateAllowableStress,
} = singleSlice.actions;

export const selectSingleMaterial = (state: RootState) => state.single.selectedMaterial;
export const selectSingleUnit = (state: RootState) => state.single.currentUnit;

export default singleSlice.reducer;
