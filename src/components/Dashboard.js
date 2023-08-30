import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./Dashboard.css";
import AddProduct from "./AddProduct";
import Purchase from "./Purchase";
import SellProduct from "./SellProduct";
import ReceiptBox from "./ReceiptBox";
import { productImageMapping } from "./productImageMapping";

const Dashboard = () => {
  const [productList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [sellList, setSellList] = useState({});

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products"));

    if (savedProducts) {
      const updatedProducts = savedProducts.map((product) => {
        const defaultImage =
          productImageMapping[product.productName] || "images/default.jpg";
        return {
          ...product,
          productImg: product.productImg || defaultImage,
        };
      });

      setProductList(updatedProducts);
    }

    const savedPurchaseList = JSON.parse(localStorage.getItem("purchaseList"));
    if (savedPurchaseList) {
      setPurchaseList(savedPurchaseList);
    }
    const savedSellList = JSON.parse(localStorage.getItem("sellList"));
    if (savedSellList) {
      setSellList(savedSellList);
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("products", JSON.stringify(productList));
  // }, [productList]);

  // useEffect(() => {
  //   localStorage.setItem("purchaseList", JSON.stringify(purchaseList));
  // }, [purchaseList]);

  return (
    <Router>
      <div className="dashboard">
        <div className="app-bar bg1 fc2 box-center jce pr48">
          <form className="search-top flx1 ml32 mr48 v-center">
            <label className="search-top-icon"><span class="material-symbols-outlined fs24 fc3">
search
</span></label>
            <input type="text" placeholder="Search..." className="search-top-input brd2 flx1 h40 br2 plr48 fs14"/>
          </form>

          <div className="notify-icon h48 w48 box-center cp fc3 ml48"><span class="material-symbols-outlined">circle_notifications</span></div>

          <div className="help-icon h48 w48 mr8 box-center cp fc3"><span class="material-symbols-outlined">help</span></div>

          <div className="avatar fs15 v-center h48 cp fc3"><span class="material-symbols-outlined fs32 mr4">account_circle</span>Naveen<span class="material-symbols-outlined fs18 ml4">arrow_drop_down</span></div>
        </div>
        <main className="w100 df jce">
          <div className="drawer bg3 df fdc pf t0 l0">
            <h1 className="fs28 fw7 ptb16 tac mb32 mt32 fc1">Click-N-Bill</h1>
            <div className="nav-group brd-b2">
              <h2 className="fs18 fw5 ls1 p16 mb8 ttu mt48 fc5">Products</h2>
              <NavLink
                to="/addProduct"
                className="nav-item v-center fs15 ptb12 plr16 fw6 fc5 ls1 mb8"
                activeClassName="active"
              >
                <span class="material-symbols-outlined fs24 mr8 ">library_add</span>Add Product
              </NavLink>
              <NavLink
                to="/purchase"
                className="nav-item v-center fs15 ptb12 plr16 fw6 fc5 ls1 mb8"
                activeClassName="active"
              >
                <span class="material-symbols-outlined fs24 mr8 ">shopping_bag</span>Purchase Product
              </NavLink>
              <NavLink
                to="/sellProduct"
                className="nav-item v-center fs15 ptb12 plr16 fw6 fc5 ls1 mb8"
                activeClassName="active"
              >
                <span class="material-symbols-outlined fs24 mr8 ">storefront</span>Sell Product
              </NavLink>
            </div>
            <div className="nav-group  brd-b2">
              <h2 className="fs16 fw5 ls1 p16 mb8 ttu mt24 fc5">Configurations</h2>
              <div
                to="/sellProduct"
                className="nav-item v-center fs15 ptb12 plr16 fw6 fc5 ls1 mb8"
                activeClassName="active"
              >
                <span class="material-symbols-outlined fs24 mr8 ">dashboard</span>Dashboard
              </div>
              <div
                to="/sellProduct"
                className="nav-item v-center fs15 ptb12 plr16 fw6 fc5 ls1 mb8"
                activeClassName="active"
              >
                <span class="material-symbols-outlined fs24 mr8 ">summarize</span>Reports
              </div>
              <div
                to="/sellProduct"
                className="nav-item v-center fs15 ptb12 plr16 fw6 fc5 ls1 mb8"
                activeClassName="active"
              >
                <span class="material-symbols-outlined fs24 mr8 ">settings</span>Settings
              </div>
            </div>
            
          </div>
          <div className="clipboard bg1 df jcsb mr24 br8">
            <Routes>
              <Route
                path="/addProduct"
                element={
                  <AddProduct
                    productList={productList}
                    setProductList={setProductList}
                    sellList={sellList} // Pass sellList
                    setSellList={setSellList} // Pass setSellList
                  />
                }
              />
              <Route
                path="/purchase"
                element={
                  <Purchase
                    productList={productList}
                    purchaseList={purchaseList}
                    setPurchaseList={setPurchaseList}
                    setProductList={setProductList}
                    productImageMapping={productImageMapping}
                    sellList={sellList} 
                  />
                }
              />
              <Route
                path="/sellProduct"
                element={
                  <SellProduct
                  purchaseList={purchaseList}
                  setPurchaseList={setPurchaseList}
                  productList={productList}
                  productImageMapping={productImageMapping}
                  sellList={sellList}
                  />
                }
              />
              <Route
                path="/sales"
                element={<ReceiptBox productList={productList} />}
              />
              <Route
                path="/"
                element={
                  <SellProduct
                    purchaseList={purchaseList}
                    setPurchaseList={setPurchaseList}
                    productList={productList}
                    productImageMapping={productImageMapping}
                    sellList={sellList}
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default Dashboard;
