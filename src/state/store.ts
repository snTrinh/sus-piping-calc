
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';


import materialReducer from './materialSlice';
import unitReducer from './unitSlice';

export const store = configureStore({
  reducer: {
    material: materialReducer,
    unit: unitReducer,
  },
 
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 