import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import singleReducer from "./singleSlice";
import multipleReducer from "./multipleSlice";
import unitReducer from "./unitSlice";

export const store = configureStore({
  reducer: {
    unit: unitReducer,
    single: singleReducer,
    multiple: multipleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
