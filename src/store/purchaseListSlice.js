import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchaseList: {},
};

const purchaseListSlice = createSlice({
  name: "purchaseList",
  initialState,
  reducers: {
    updatePurchaseList(state, action) {
      state.purchaseList = action.payload;
    }
  },
});

export const { updatePurchaseList, updateSellList } = purchaseListSlice.actions;
export default purchaseListSlice.reducer;
