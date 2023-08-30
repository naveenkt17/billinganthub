import React from 'react';

const ReceiptBox = ({ productList }) => {
  return (
    <div className="receipt-box mtb16 mr16 br8 brd1 plr16 pt32 pb32">
      <h2 className='fs18 fw7 mb24 ttu mt32'>{productList?"List of Products":"Receipt"}</h2>
      <ul>
        {productList.map((product, index) => (
          <li key={index} className="ptb16 brd-b1 pl16">{index+1}{"- "}{product.productName}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReceiptBox;
