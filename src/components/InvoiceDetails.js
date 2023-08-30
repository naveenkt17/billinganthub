import React from "react";

const InvoiceDetails = ({ products }) => {
  return (
    <div className="invoice-details">
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Product Name</th>
            <th>Sell Price</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.code}>
              <td>{index + 1}</td>
              <td>{product.productName}</td>
              <td>{product.sellPrice}</td>
              <td>{product.productQuantity} pcs</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceDetails;
