import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Estimate } from "../../Types";

interface EstimatesState {
  estimates: Estimate[];
  currentEstimate: Estimate | null;
  progressBars: { [key: string]: number };
}

const initialState: EstimatesState = {
  estimates: [],
  currentEstimate: null,
  progressBars: {},
};

export const estimatesSlice = createSlice({
  name: "estimates",
  initialState,
  reducers: {
    addEstimate: (state, action: PayloadAction<Estimate>) => {
      state.estimates.push({ ...action.payload, id: Date.now().toString() });
    },
    setCurrentEstimate: (state, action: PayloadAction<Estimate | null>) => {
      state.currentEstimate = action.payload;
    },
    updateEstimateProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const { id, progress } = action.payload;
      state.progressBars[id] = progress;
      const estimate = state.estimates.find((e) => e.id === id);
      if (estimate) estimate.progress = progress;
    },
    updateEstimateDetails: (
      state,
      action: PayloadAction<{ id: string; details: { [key: string]: string } }>
    ) => {
      const { id, details } = action.payload;
      const estimate = state.estimates.find((e) => e.id === id);
      if (estimate) estimate.details = details;
    },
    deleteEstimateDetail: (
      state,
      action: PayloadAction<{ id: string; key: string }>
    ) => {
      const { id, key } = action.payload;
      const estimate = state.estimates.find((e) => e.id === id);
      if (estimate && estimate.details) {
        delete estimate.details[key];
      }
    },
  },
});

export const { addEstimate, setCurrentEstimate, updateEstimateProgress, updateEstimateDetails, deleteEstimateDetail } = estimatesSlice.actions;
export default estimatesSlice.reducer;