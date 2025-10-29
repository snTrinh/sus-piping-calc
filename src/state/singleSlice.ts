import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialName } from "../utils/materialsData";
import { npsToMmMap, PipeSchedule } from "@/utils/unitConversions";
import { RootState } from "./store";
import { Pipe } from "@/types/pipe";
import { calculateTRequired } from "@/utils/pipeCalculations";
import { Units } from "@/types/units";
import pipeData from "@/data/transformed_pipeData.json";
import { E, GAMMA, MILL_TOL, W } from "@/constants/constants";

interface SingleState {
  global: GlobalDesignParams;
  pressure: number;
  temperature: number;
  selectedMaterial: MaterialName;
  pipes: Pipe[];
}

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
  pipes: [],
};

export const singleSlice = createSlice({
  name: "singlePressure",
  initialState,
  reducers: {
    addPipeSingle(
      state,
      action: PayloadAction<{
        id: string;
        nps: string;
        schedule: PipeSchedule;
        od: string;
      }>
    ) {
      const { id, nps, schedule, od } = action.payload;
      const units = Units.Imperial;
      const targetNpsKey =
        (units as Units) === Units.Metric ? npsToMmMap[nps] : nps;
      const pipeDataEntry = (pipeData as any)[units]?.[targetNpsKey];
      const odValue = pipeDataEntry?.OD ?? 0;
      const tValue = pipeDataEntry?.schedules?.[schedule] ?? 0;
      const { corrosionAllowance, e, w, gamma, millTol } = state.global;
      const pressure = state.pressure;

      // sample: use material stress (here hardcoded; later pull from materialsData)
      const allowableStress = 20000; // psi default or lookup from materialsData

      // compute tRequired in imperial units
      const paramsForCalc = {
        pressure,
        outerDiameterInches: odValue,
        allowableStress,
        e,
        w,
        gamma,
        corrosionAllowanceInches: corrosionAllowance,
        millTol,
      };
      const tRequired = calculateTRequired(paramsForCalc);

      state.pipes.push({
        id,
        nps,
        schedule,
        od,
        t: tValue,
        tRequired,
        allowableStress,
      });
    },

    updatePipeSingleField: (
      state,
      action: PayloadAction<{ pipeId: string; key: keyof Pipe; value: any }>
    ) => {
      const { pipeId, key, value } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (pipe) {
        // @ts-ignore
        pipe[key] = value;
      }
    },

    removePipe(state, action: PayloadAction<string>) {
      state.pipes = state.pipes.filter((p) => p.id !== action.payload);
    },

    updatePressure(state, action: PayloadAction<number>) {
      state.pressure = action.payload;
    },

    updateTemperature(state, action: PayloadAction<number>) {
      state.temperature = action.payload;
    },

    setMaterial(state, action: PayloadAction<MaterialName>) {
      state.selectedMaterial = action.payload;
    },

    updatePipeTRequiredSingle(
      state,
      action: PayloadAction<{ pipeId: string; tRequired: number }>
    ) {
      const pipe = state.pipes.find((p) => p.id === action.payload.pipeId);
      if (pipe) pipe.tRequired = action.payload.tRequired;
    },
    updateCorrosionAllowance(state, action: PayloadAction<number>) {
      state.global.corrosionAllowance = action.payload;
    },
    updateAllowableStress(
      state,
      action: PayloadAction<{ pipeId: string; allowableStress: number }>
    ) {
      const { pipeId, allowableStress } = action.payload;
      const pipe = state.pipes.find((p) => p.id === pipeId);
      if (pipe) {
        pipe.allowableStress = allowableStress;
      }
    },
  },
});

export const {
  addPipeSingle,
  removePipe,
  updatePressure,
  updateTemperature,
  setMaterial,
  updatePipeTRequiredSingle,
  updateCorrosionAllowance,
  updateAllowableStress,
  updatePipeSingleField,
} = singleSlice.actions;

export const selectSingleMaterial = (state: RootState) =>
  state.single.selectedMaterial;

export default singleSlice.reducer;
