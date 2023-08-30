import React from 'react';
import "./PurchaseSide.css"

const PurchaseSide = ({ productList, handleSavePurchase }) => {
  const purchaseListArray = Object.values(productList);

  return (
    <>
     
      <div className='table-container df fdc aic' >
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th> Buy</th>
              <th>Quantity</th>
              <th> Sell</th>
              <th> Action</th>
            </tr>
          </thead>
          <tbody>
            {purchaseListArray.map((purchaseArray, purchaseIndex) => (
              purchaseArray.map((purchase, index) => (
                <tr key={`${purchaseIndex}_${index}`}>
                  <td>{purchase.productName}</td>
                  <td><span class="material-symbols-outlined fs12">currency_rupee</span>{purchase.buyPrice}</td>
                  <td>{purchase.quantity}</td>
                  <td><span class="material-symbols-outlined fs12">currency_rupee</span>{purchase.sellPrice}</td>
                  <td><span className='v-center'>

                  <span class="material-symbols-outlined fs18 fc8 cp mr4">edit</span> / 
                  <span class="material-symbols-outlined fs18 fc7 cp ml4">delete</span>
                  </span>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
       
                  
        <div className="w100 df jcsb ase">
          <button  className="bg2 fc1 ttu fs16 fw5 ls1 plr32 h48 box-center br2 mt32 cp">Reset Entry</button>
            <button onClick={handleSavePurchase} className=" bg7 fc1 ttu fs16 fw5 ls1 plr32 h48 box-center br2 mt32 cp">Add Purchage</button>
            
          </div>
      </div>
    </>
  );
};

export default PurchaseSide;
