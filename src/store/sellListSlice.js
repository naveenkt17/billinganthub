import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellList: {},
};

const sellListSlice = createSlice({
  name: "sellList",
  initialState,
  reducers: {
    updateSellList(state, action) {
      state.sellList = action.payload;
    },
    clearSellList(state) {
      state.sellList = {};
    },
  },
});

export const { updateSellList, clearSellList } = sellListSlice.actions;
export default sellListSlice.reducer;
