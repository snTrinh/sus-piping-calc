import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Units } from "@/types/units";

interface UnitState {
  currentUnit: Units;
}

const initialState: UnitState = {
  currentUnit: Units.Imperial,
};

export const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    setUnit: (state, action: PayloadAction<Units>) => {
      state.currentUnit = action.payload;
    },
  },
});

export const { setUnit } = unitSlice.actions;

export const selectUnit = (state: { unit: UnitState }) => state.unit.currentUnit;

export default unitSlice.reducer;
