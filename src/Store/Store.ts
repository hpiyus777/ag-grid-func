// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../features/data/dataSlice";
import estimatesReducer from "../features/data/estimatesSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    estimates: estimatesReducer,
  },
});

// other exports

export type RootState = ReturnType<typeof store.getState>;