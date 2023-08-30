import { configureStore } from "@reduxjs/toolkit";
// import purchaseSliceReducer from "./purchaseSlice";
import purchaseListSliceReducer from "./purchaseListSlice";
import productListReducer from "./productListSlice";
import sellListReducer from "./sellListSlice";

const store = configureStore({
  reducer: {
    // purchase: purchaseSliceReducer,
    purchaseList: purchaseListSliceReducer,
    productList: productListReducer,
    sellList: sellListReducer,
  },
});

export default store;
