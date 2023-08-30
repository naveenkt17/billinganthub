import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import "./Purchase.css";
import defImage from "../images/default01.svg";
import PurchaseSide from "./PurchaseSide";
import moment from "moment";
import { updatePurchaseList } from "../store/purchaseListSlice";
import { updateSellList } from "../store/sellListSlice";

const Modal = ({ title, children }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

const Purchase = ({ productList, setProductList, productImageMapping }) => {
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [step, setStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseList, setPurchaseList] = useState({});
  const [isPurchaseSaved, setIsPurchaseSaved] = useState(false);
  const [sellList, setSellList] = useState({}); 

  const todayDate = moment().format("DD-MM-YYYY");

  const quantityInputRef = useRef(null);
  const sellPriceInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedPurchaseList = JSON.parse(localStorage.getItem("purchaseList"));
    if (savedPurchaseList) {
      setPurchaseList(savedPurchaseList);
    }

    const savedSellList = JSON.parse(localStorage.getItem("sellList"));
    if (savedSellList) {
      setSellList(savedSellList);
    }
  }, []);

  const handleProductCardClick = (product) => {
    setIsModalOpen(true);
    setStep(1);
    setSelectedProduct(product);
  };

  const handleBuyPriceKeyPress = (event) => {
    if (event.key === "Enter") {
      setStep(2);
    }
  };

  const handleQuantityKeyPress = (event) => {
    if (event.key === "Enter") {
      setStep(3);
    }
  };

  const handleSellPriceKeyPress = (event) => {
    if (event.key === "Enter") {
      savePurchaseDetails();
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setBuyPrice("");
    setQuantity("");
    setSellPrice("");
    setStep(0);
    setSelectedProduct(null);
  };

  const updateSellListForPurchase = (purchase) => {
    const { productName, sellPrice, quantity } = purchase;
    const sellName = `${productName}_${sellPrice}`;
  
    setPurchaseList((prevPurchaseList) => {
      const todayDate = moment().format("DD-MM-YYYY");
      const existingPurchases = prevPurchaseList[todayDate] || {};
  
      const purchaseKeys = Object.keys(existingPurchases);
      const maxPurchaseIndex = purchaseKeys.reduce((maxIndex, key) => {
        const purchaseIndex = parseInt(key.replace("purchase", ""));
        return isNaN(purchaseIndex) ? maxIndex : Math.max(maxIndex, purchaseIndex);
      }, 0);
  
      const purchaseKey = `purchase${maxPurchaseIndex + 1}`;
      const updatedPurchases = {
        ...existingPurchases,
        [purchaseKey]: [purchase],
      };
  
      const updatedPurchaseList = {
        ...prevPurchaseList,
        [todayDate]: updatedPurchases,
      };
  
      dispatch(updatePurchaseList(updatedPurchaseList));
      localStorage.setItem("purchaseList", JSON.stringify(updatedPurchaseList));
  
      return updatedPurchaseList;
    });
  
    setSellList((prevSellList) => {
      const updatedSellList = { ...prevSellList };
  
      if (productName in updatedSellList) {
        const existingProduct = updatedSellList[productName];
        const existingSellIndex = existingProduct.findIndex(
          (sell) => sell.sellName === sellName
        );
  
        if (existingSellIndex !== -1) {
          const updatedExistingSell = {
            ...existingProduct[existingSellIndex],
            productQuantity:
              existingProduct[existingSellIndex].productQuantity + quantity,
            averagePrice:
              (sellPrice * quantity +
                existingProduct[existingSellIndex].averagePrice *
                  existingProduct[existingSellIndex].productQuantity) /
              (existingProduct[existingSellIndex].productQuantity + quantity),
          };
  
          const updatedProductArray = [...existingProduct]; // yaha ek copy hai product ki 
          updatedProductArray[existingSellIndex] = updatedExistingSell;
          updatedSellList[productName] = updatedProductArray;
        } else {
          // addd kar dega new item ek copy bana ke
          updatedSellList[productName] = [
            ...existingProduct,
            {
              sellName,
              averagePrice: sellPrice,
              productQuantity: quantity,
              sellPrice,
            },
          ];
        }
      } else {
        // agar product sell mei nahi to naya add karne ke liye
        updatedSellList[productName] = [
          {
            sellName,
            averagePrice: sellPrice,
            productQuantity: quantity,
            sellPrice,
          },
        ];
      }
  
      dispatch(updateSellList(updatedSellList));
      localStorage.setItem("sellList", JSON.stringify(updatedSellList));
  
      return updatedSellList;
    });
  };
  
  const savePurchaseDetails = () => {
    if (!selectedProduct) return;

    const productCode = `${selectedProduct.productName}_${buyPrice}_${sellPrice}`;

    // const existingPurchaseIndex = purchaseList[todayDate]?.length || 0;

    const newPurchase = {
      productCode: productCode,
      productName: selectedProduct.productName,
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
      quantity: parseInt(quantity),
      averagePrice: 0,
    };

    updateSellListForPurchase(newPurchase);

    setBuyPrice("");
    setQuantity("");
    setSellPrice("");
    setStep(0);
    setSelectedProduct(null);
    setIsPurchaseSaved(false);
  };

  const handleSavePurchase = () => {
    if (purchaseList[todayDate]?.length > 0) {
      setIsPurchaseSaved(true);
      updateSellListForPurchase(purchaseList[todayDate]);
      localStorage.setItem("temporaryPurchaseList", JSON.stringify([]));
    }
  };
  
  return (
    <div>
   
      <div className="w100 df">
        {step === 0 && (
          <div className="ml24">
              <h2 className="mt48 mb32 fs24 fc3 fw5">Add Purchase Quantity</h2>
            <div
              id="productList"
              className="product-list df fww"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleProductCardClick(productList[0]);
              }}
            >
              {Array.isArray(productList) && productList.length > 0 ? (
                productList.map((product, index) => (
                  <div
                    key={index} 
                    className="product-card box-center fdc bg-gr1"
                    onClick={() => handleProductCardClick(product)}
                  >
                    <div className="prd-img box-center br50 ofh bg1 p16">
                    <img src={productImageMapping[product.productName] || defImage} alt={product.productName} />
                    </div>
                   
                    <p className="prd-name h-center aie">{product.productName}</p>
                  </div>
                ))
              ) : (
                <p>No products available.</p>
              )}
            </div>
          </div>
        )}

        {isModalOpen && (
          <Modal
            title={
              step === 1
                ? "Enter Buy Price"
                : step === 2
                ? "Enter Quantity"
                : "Enter Sell Price"
            }
          >
            {step === 1 && (
              <input
                type="text"
                id="buyPriceInput"
                placeholder="Buy Price"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                onKeyPress={handleBuyPriceKeyPress}
                autoFocus
              />
            )}

            {step === 2 && (
              <input
                type="text"
                id="quantityInput"
                ref={quantityInputRef}
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyPress={handleQuantityKeyPress}
                autoFocus
              />
            )}

            {step === 3 && (
              <div>
                <input
                  type="text"
                  id="sellPriceInput"
                  ref={sellPriceInputRef}
                  placeholder="Sell Price"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  onKeyPress={handleSellPriceKeyPress}
                  autoFocus
                />
                <br />
                <button onClick={handleModalClose}>Cancel</button>
                <button onClick={savePurchaseDetails}>Save Purchase</button>
              </div>
            )}
          </Modal>
        )}

        {isPurchaseSaved ? (
          <PurchaseSide productList={Object.values(purchaseList[todayDate])} />
        ) : (
          <div className="purchage-box mt16 mr16 br8 brd1 plr16 pt32 pb32">


          <div className="invoice-title df jcsb mb24">
            
            <h2 className='fs18 fw7 mb24 ttu'>
              Purchase List 
              <span className="df aic fs16 fw5 fc11 mt4">
                <span class="mr8 material-symbols-outlined">calendar_month</span>{todayDate}
              </span>
            </h2>
            <div className="company-dtl">
            <h2 className="company-title fs24 fc4">ANT HUB</h2>
            <p className="fs14 ls1 fc3 mt4 brd-b1 pb8">All New Trends</p>
            {/* <p className="fs14 ls1 fc9 mt8 brd-b1 pb8 lh22">KH no. 40, CH AK <br/>Shahberi G B Nagar</p> */}
            </div>
          </div>



            
            <PurchaseSide
              productList={purchaseList[todayDate] || []}
              handleSavePurchase={handleSavePurchase}
              sellList={sellList}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;
