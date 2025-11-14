// singleSlice.ts
import { E, GAMMA, MILL_TOL, W } from "@/constants/constants";
import imperialPipeData from "@/data/imperialData.json";
import metricPipeData from "@/data/metricData.json";
import { GlobalDesignParams } from "@/types/globalDesignParams";
import { Pipe } from "@/types/pipe";
import { Units } from "@/types/units";
import { calculateTRequired } from "@/utils/pipeCalculations";
import { npsToDnMap, PipeSchedule } from "@/utils/unitConversions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllowableStressForTemp,
  MaterialName,
} from "../utils/materialsData";
import { RootState } from "./store";

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

function recalcPipe(
  pipe: Pipe,
  units: Units,
  global: GlobalDesignParams,
  pressure: number,
  material: MaterialName,
  temperature: number
) {
  const pipeDataEntry =
    units === Units.Metric ? metricData[pipe.dn] : imperialData[pipe.nps];
  if (!pipeDataEntry) return;


  pipe.od = pipeDataEntry.OD;
  pipe.t = pipeDataEntry.schedules[pipe.schedule] ?? 0;

  pipe.allowableStress = getAllowableStressForTemp(
    material,
    units,
    temperature
  );

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
    setUnit(state, action: PayloadAction<Units>) {
      const newUnit = action.payload;
      state.currentUnit = newUnit;

      state.pipes.forEach((pipe) => {
        recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);
      });
    },

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
        allowableStress: 20000,
      };
      recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);

      state.pipes.push(pipe);
    },

    updatePipeSingleField(
      state,
      action: PayloadAction<{
        pipeId: string;
        key: keyof Pipe;
        value: string | number;
      }>
    ) {
      const { pipeId, key, value } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (!pipe) return;

      if (["od", "t", "tRequired", "allowableStress"].includes(key)) {
        (pipe[key] as number) = value as number;
      } else if (["nps", "dn", "schedule", "id"].includes(key)) {
        (pipe[key] as string) = value as string;
      }

      if (key === "nps" || key === "schedule") {
        pipe.dn = npsToDnMap[pipe.nps];
        recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature);
      }
    },

    removePipe(state, action: PayloadAction<string>) {
      state.pipes = state.pipes.filter((p) => p.id !== action.payload);
    },

    updatePressure(state, action: PayloadAction<number>) {
      state.pressure = action.payload;
      state.pipes.forEach((pipe) =>
        recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature)
      );
    },

    updateTemperature(state, action: PayloadAction<number>) {
      state.temperature = action.payload;
    },

    setMaterial(state, action: PayloadAction<MaterialName>) {
      state.selectedMaterial = action.payload;
    },

    updateCorrosionAllowance(state, action: PayloadAction<number>) {
      state.global.corrosionAllowance = action.payload;
      state.pipes.forEach((pipe) =>
        recalcPipe(pipe, state.currentUnit, state.global, state.pressure, state.selectedMaterial, state.temperature)
      );
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
    resetSingleSlice: () => initialState,
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
  resetSingleSlice,
} = singleSlice.actions;

export const selectSingleMaterial = (state: RootState) =>
  state.single.selectedMaterial;
export const selectSingleUnit = (state: RootState) => state.single.currentUnit;

export default singleSlice.reducer;
