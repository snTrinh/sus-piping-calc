import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialName } from "../utils/materialsData";

import { Pipe } from "@/types/pipe";

import { E, GAMMA, MILL_TOL, W } from "@/constants/constants";
import { GlobalDesignParams } from "@/types/globalDesignParams";
interface MultiplePipe {
  pipe: Pipe;
  material: MaterialName;
  pressure: number;
  temperature: number;
}

interface MultipleState {
  global: GlobalDesignParams;
  pipes: MultiplePipe[];
}

const initialState: MultipleState = {
  global: {
    corrosionAllowance: 0,
    e: E,
    w: W,
    gamma: GAMMA,
    millTol: MILL_TOL,
  },
  pipes: [],
};

export const multipleSlice = createSlice({
  name: "multiplePressure",
  initialState,
  reducers: {

    removePipeMultiple(state, action: PayloadAction<string>) {
      state.pipes = state.pipes.filter((p) => p.pipe.id !== action.payload);
    },

    updatePipeMaterialMultiple(
      state,
      action: PayloadAction<{ pipeId: string; material: MaterialName }>
    ) {
      const wrapper = state.pipes.find(
        (p) => p.pipe.id === action.payload.pipeId
      );
      if (wrapper) wrapper.material = action.payload.material;
    },

    updatePipePressureMultiple(
      state,
      action: PayloadAction<{ pipeId: string; pressure: number }>
    ) {
      const wrapper = state.pipes.find(
        (p) => p.pipe.id === action.payload.pipeId
      );
      if (wrapper) wrapper.pressure = action.payload.pressure;
    },

    updatePipeTemperatureMultiple(
      state,
      action: PayloadAction<{ pipeId: string; temperature: number }>
    ) {
      const wrapper = state.pipes.find(
        (p) => p.pipe.id === action.payload.pipeId
      );
      if (wrapper) wrapper.temperature = action.payload.temperature;
    },

    updateCorrosionAllowance(state, action: PayloadAction<number>) {
      state.global.corrosionAllowance = action.payload;
    },

    updatePipeAllowableStress(
      state,
      action: PayloadAction<{ pipeId: string; allowableStress: number }>
    ) {
      const wrapper = state.pipes.find(
        (p) => p.pipe.id === action.payload.pipeId
      );
      if (wrapper)
        wrapper.pipe.allowableStress = action.payload.allowableStress;
    },

    updatePipeField(
      state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: PayloadAction<{ pipeId: string; key: keyof Pipe; value: any }>
    ) {
      const wrapper = state.pipes.find(
        (p) => p.pipe.id === action.payload.pipeId
      );
      if (wrapper) {
        // @ts-expect-error error here
        wrapper.pipe[action.payload.key] = action.payload.value;
      }
    },
  },
});

export const {
  removePipeMultiple,
  updatePipeMaterialMultiple,
  updatePipePressureMultiple,
  updatePipeTemperatureMultiple,
  updateCorrosionAllowance,
  updatePipeAllowableStress,
  updatePipeField,
} = multipleSlice.actions;

export const selectMultiplePipes = (state: {
  multiplePressure: MultipleState;
}) => state.multiplePressure.pipes;

export const selectMultipleGlobal = (state: {
  multiplePressure: MultipleState;
}) => state.multiplePressure.global;

export default multipleSlice.reducer;
