import React, { useState, useEffect } from "react";
import defImage from "../images/default01.svg";
import Modal from "../components/Modal";

const findProductBySellName = (sellName, products) => {
  for (const productCategory in products) {
    if (products.hasOwnProperty(productCategory)) {
      const productsOfType = products[productCategory];
      if (Array.isArray(productsOfType)) {
        const foundProduct = productsOfType.find(
          (product) => product.sellName === sellName
        );
        console.log("Found product:", foundProduct);
        if (foundProduct) {
          return { ...foundProduct, productCategory };
        }
      }
    }
  }
  return null;
};

const SellProduct = ({ productImageMapping }) => {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [renderData, setRenderData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [customerPayment, setCustomerPayment] = useState(0);
  const [modalProduct, setModalProduct] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("sellList")) || {};
    console.log("storedProducts:", storedProducts);

    const updatedRenderData = [];

    for (const productCategory in storedProducts) {
      if (storedProducts.hasOwnProperty(productCategory)) {
        const productsOfType = storedProducts[productCategory];

        if (Array.isArray(productsOfType)) {
          productsOfType.forEach((product) => {
            const { sellName, productQuantity, sellPrice } = product;

            updatedRenderData.push(
              <div
                key={`${sellName}_${productCategory}`}
                className="product-card box-center fdc bg-gr1"
                onClick={() => handleCardClick(sellName)}
              >

                    <div className="prd-img box-center br50 ofh bg1 p16">
                      <img src={productImageMapping[product.productName] || defImage} alt={productCategory} />
                    </div>
              
                <p className="prd-name tac">{sellName}</p>
                <p className="dn">Quantity: {productQuantity}</p>
                <p className="dn">Sell Price: {sellPrice}</p>
              </div>
            );
          });
        }
      }
    }

    setRenderData(updatedRenderData);
  }, [productImageMapping]);

  const handleCardClick = (sellName) => {
    setModalProduct(sellName);
    setIsPopupOpen(true);
  };
  const handleModalClose = () => {
    setIsPopupOpen(false);
    setModalProduct(null);
  };

  const handleQuantitySubmit = async (event) => {
    const storedProducts = JSON.parse(localStorage.getItem("sellList")) || {};

    if (event.key === "Enter" || event.keyCode === 13 || event.which === 13) {
      console.log("handleQuantitySubmit called");
      console.log("Key pressed:", event.key);
      const quantity = parseInt(event.target.value);

      if (!isNaN(quantity) && quantity > 0) {
        console.log("Parsed quantity:", quantity);
        const product = findProductBySellName(modalProduct, storedProducts);
        console.log("Found product:", product);

        if (product) {
          const totalPrice = product.sellPrice * quantity;

          const updatedProducts = {
            ...storedProducts,
            [product.productCategory]: storedProducts[
              product.productCategory
            ].map((item) =>
              item.sellName === modalProduct
                ? { ...item, productQuantity: item.productQuantity - quantity }
                : item
            ),
          };

          
          const existingProductIndex = invoiceDetails.findIndex(
            (item) => item.sellName === modalProduct
          );

          if (existingProductIndex !== -1) {
            const updatedInvoiceDetails = [...invoiceDetails];
            const updatedProduct = {
              ...invoiceDetails[existingProductIndex],
              quantity:
                invoiceDetails[existingProductIndex].quantity + quantity,
              totalPrice:
                product.sellPrice *
                (invoiceDetails[existingProductIndex].quantity + quantity),
            };
            updatedInvoiceDetails[existingProductIndex] = updatedProduct;
            setInvoiceDetails(updatedInvoiceDetails);
          } else {
            const updatedInvoiceDetails = [
              ...invoiceDetails,
              {
                sellName: modalProduct,
                quantity: quantity,
                sellPrice: product.sellPrice,
                totalPrice: totalPrice,
              },
            ];
            setInvoiceDetails(updatedInvoiceDetails);
          }

          localStorage.setItem("sellList", JSON.stringify(updatedProducts));

          setSelectedProducts((prevSelectedProducts) => ({
            ...prevSelectedProducts,
            [modalProduct]: {
              ...prevSelectedProducts[modalProduct],
              productQuantity: quantity,
            },
          }));

          setIsPopupOpen(false);
          setModalProduct(null);

          const newTotalBill = calculateTotalBill();
          setTotalBill(newTotalBill);

          const newChangeAmount = calculateChangeAmount();
          setChangeAmount(newChangeAmount);
        }
      }
    }
  };
  const calculateTotalBill = () => {
    let total = 0;

    invoiceDetails.forEach((product) => {
      total += product.totalPrice;
    });

    return total.toFixed(2);
  };

  const handlePaymentChange = (event) => {
    setCustomerPayment(event.target.value);
  };

  const calculateChangeAmount = () => {
    const totalBill = parseFloat(
      discountPercentage > 0
        ? calculateDiscountedTotalBill()
        : calculateTotalBill()
    );
    const payment = parseFloat(customerPayment);

    if (isNaN(payment)) {
      return 0;
    }

    return (payment - totalBill).toFixed(2);
  };

  const handleDiscountChange = (event) => {
    setDiscountPercentage(event.target.value);
  };

  const calculateDiscountedTotalBill = () => {
    const totalBill = parseFloat(calculateTotalBill());
    const discountAmount = (totalBill * discountPercentage) / 100;
    return (totalBill - discountAmount).toFixed(2);
  };
  const handlePrintBill = () => {
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(
        `<html><head><title>Print Bill</title></head><body>`
      );
      printWindow.document.write("<h3>Invoice:</h3>");
      printWindow.document.write("<table border='1'>");
      printWindow.document.write(
        "<thead><tr><th>Serial No</th><th>Product Name</th><th>Quantity</th><th>Sell Price</th><th>Total Price</th></tr></thead><tbody>"
      );

      invoiceDetails.forEach((product, index) => {
        printWindow.document.write(
          `<tr><td>${index + 1}</td><td>${product.sellName}</td><td>${
            product.quantity
          }</td><td>${product.sellPrice}</td><td>${product.totalPrice.toFixed(
            2
          )} Rs/-</td></tr>`
        );
      });

      printWindow.document.write("</tbody></table>");
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      printWindow.print();
    }
  };

  return (
    <div className="w100  ais ml24 ">
     
      <div className="sell-board df">
      
        <div className="sell-list">
        <h2 className="mt48 mb32 fs24 fc3 fw5">Sell Product</h2>
        <div className="sell-list-items df fww">
        {renderData}
        </div>
       
        </div>

        {isPopupOpen && (
        <Modal title="Enter Quantity">
          <input
            type="number"
            id="quantityInput"
            autoFocus
            onKeyDown={handleQuantitySubmit}
          />
          <button onClick={handleModalClose}>Cancel</button>
          <button onClick={handleQuantitySubmit}>Add</button>
        </Modal>
      )}
 {invoiceDetails.length >= 0 && (
        <div className="invoice-box mt32 brd1 br8 p16">
          <div className="invoice-title df jcsb mb24">
            <div className="company-dtl">
            <h2 className="company-title fs24 fc4">ANT HUB</h2>
            <p className="fs14 ls1 fc3 mt4 brd-b1 pb8">All New Trends</p>
            {/* <p className="fs14 ls1 fc9 mt8 brd-b1 pb8 lh22">KH no. 40, CH AK <br/>Shahberi G B Nagar</p> */}
            </div>
          <h3 className="fs24 ttu fw6 mr24">Invoice</h3>
          </div>
          <div className="invoice-credits df jcsb mb24">
            <div className="billto-dtl">
              <h2 className="company-title fs16 fc2 fw7">Bill To</h2>
              <p className="fs14 ls1 fc2 fw6 mt12">Customer 01</p>
              <p className="fs14 ls1 fc9 mt4 lh22">Sai Upvan Soiciety</p>
            </div>
            <div className="invoice-dtl">
              <p className="fs14 ls1 fc2 fw6 mt12 v-center jce"><span className="fw7 mr16">Invoice #</span>Customer 01</p>
              <p className="fs14 ls1 fc2 fw6 mt12 v-center jce"><span className="fw7 mr16">Invoice Date</span>25/08/2023</p>
            </div>
          </div>
         
          <table>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Sell Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails.map((product, index) => (
                <tr key={`${product.sellName}_${index}`}>
                  <td>{index + 1}</td>
                  <td>{product.sellName}</td>
                  <td>{product.quantity}</td>
                  <td>{product.sellPrice}</td>
                  <td className="fw7">{product.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
              </tbody>
              </table>
              <div className="df aisc jcsb fs16 fw6 br16 bg3 fc1 p16 mt16">
                <div className="">Total:</div>
                <div className="">{calculateTotalBill()} Rs/-</div>
              </div>

              <div className="discount-list mt32">
                <div className="v-center jce mb8">
                  <label className="tar w100 mr16">Discount Coupon (%)</label>
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={handleDiscountChange}
                    className="h40 w96 brd2 plr16 br2"
                  />
                </div>
                <div className="df aisc jcsb fs16 fw6 br16 bg8 fc1 p16 mt4">
                <div className="">Payable Total:</div>
                <div className="">{calculateDiscountedTotalBill()} Rs/-</div>
              </div>
              </div>

             
     
          <div className="v-center jcsb mb8 brd2 mt24 bg6 ptb8 plr16">
            <div className="v-center jce mb8">
              <label className="fs14 tar w100 mr16">Received:</label>
              <input
                type="number"
                value={customerPayment}
                onChange={handlePaymentChange}
                className="h40 w96 brd2 plr16 br2"
              />
            </div>
            <div className="v-center jce mb8">
              <label className="fs14 tar w100 mr16">Return Rs/: </label>
              <span className="fw7 plr16 br2 wsnw">{calculateChangeAmount()} </span>
            </div>
          </div>
                 
          <div className="df jcsb ase">
          <button  className="bg2 fc1 ttu fs16 fw5 ls1 plr32 h48 box-center br2 mt32 cp">Next Invoice</button>
            <button onClick={handlePrintBill} className="bg7 fc1 ttu fs16 fw5 ls1 plr32 h48 box-center br2 mt32 cp">Print Bill</button>
            
          </div>
         
        </div>
      )}
      </div>
    </div>
  );
};

export default SellProduct;
