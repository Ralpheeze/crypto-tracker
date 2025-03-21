import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prices: {},
  loading: false,
  error: null,
  isUpdating: true,
};

const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    setPrices: (state, action) => {
      state.prices = { ...state.prices, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
  },
});

export const { setPrices, setLoading, setError, setIsUpdating } = trackerSlice.actions;
export default trackerSlice.reducer;
