import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import { productImageMapping } from "./productImageMapping";
import { useDispatch } from "react-redux";
import { addProduct } from "../store/productListSlice";
import ReceiptBox from './ReceiptBox';

const AddProduct = ({ productList, setProductList, sellList, setSellList }) => {
  const [productName, setProductName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    if (savedProducts) {
      setProductList(savedProducts);
    }
  }, [setProductList]);

  const addProductToList = () => {
    if (productName.trim() !== '') {
      const newProduct = {
        productName: productName,
        productId: Date.now(),
        productImg: productImageMapping[productName] || "images/default.jpg",
        buyPrice: 0,
        productQuantity: 0,
        sellPrice: 0,
      };

      const updatedList = [...productList, newProduct];
      setProductList(updatedList);
      setSellList((prevSellList) => {
        return {
          ...prevSellList,
          [productName]: [],
        };
      });
      localStorage.setItem('products', JSON.stringify(updatedList));
      dispatch(addProduct(updatedList));
      setProductName('');
    }
  };

  return (
    <div className='ml360 df jcsb w100'>
      

      <div className='flx1 box-center fdc br8 brd2 card plr24 pt32 pb32 bg-gr1 bs1'>
      <h2 className="fs18 fw7 mb24 ttu fc1">Start Adding Products</h2>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            addProductToList();
          }
        }}
        placeholder="Enter New Product"
        className=' brd2 h48 plr16 w100 mb24 br2'
      />
      <button onClick={addProductToList} className='w100 h48 box-center bg3 brd2 cp fc1 ttu br2'>Enter to Add</button>
      </div>
      <ReceiptBox productList={productList}/>
    </div>
  );
};

export default AddProduct;
