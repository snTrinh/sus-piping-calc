
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MaterialName } from '../utils/materialsData'; 
import { Units } from '@/types/units';
interface UnitState {
  unit: Units;
}


const initialState: UnitState = {
    unit: Units.Imperial,
};


export const unitSlice = createSlice({
  name: 'unit', 
  initialState, 
  reducers: {

    setUnit: (state, action: PayloadAction<Units>) => {
      state.unit = action.payload;
    },
  },
});


export const { setUnit } = unitSlice.actions;

export const unit = (state: { unit: UnitState }) => state.unit.unit;

export default unitSlice.reducer;
