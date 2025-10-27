
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MaterialName } from '../utils/materialsData'; 
interface MaterialState {
  selectedMaterial: MaterialName;
}


const initialState: MaterialState = {
  selectedMaterial: 'A106B',
};


export const materialSlice = createSlice({
  name: 'materials', 
  initialState, 
  reducers: {

    setMaterial: (state, action: PayloadAction<MaterialName>) => {
      state.selectedMaterial = action.payload;
    },
  },
});


export const { setMaterial } = materialSlice.actions;

export const selectMaterial = (state: { materials: MaterialState }) => state.materials.selectedMaterial;

export default materialSlice.reducer;
