import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { VenueContext } from "../../context/VenueContext";

export const OrderSummary = ({ deliveryFee, totalCartValue }) => {
  const { cartItems, calculateSubtotal } = useContext(CartContext);

  // charges and order type
  const { charges, orderType } = useContext(VenueContext);
  // to show more details
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // handle details
  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  // calculate charge amount
  const calculateChargeAmount = (charge) => {
    if (charge.amountType === "PERCENT") {
      return (calculateSubtotal() * charge.amount) / 100;
    }
    return charge.amount;
  };

  return (
    <div className=" m-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-700">Order Summary</h3>
        <button
          onClick={toggleDetails}
          className="text-purple-600 text-sm hover:text-purple-800 cursor-pointer"
        >
          {isDetailsVisible ? "Hide details" : "Show details"}
        </button>
      </div>
      <div className="mt-4">
        {isDetailsVisible &&
          cartItems?.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-gray-800 my-2">
                <span className="flex items-center gap-2">
                  <span className="bg-slate-300 p-3 m-0 rounded-full text-center inline-block w-4 h-4 flex items-center justify-center">
                    {data.totalQuantity}
                  </span>
                  {data.itemName}
                </span>
                <h2>${data.itemPrice}</h2>
              </div>
              {data?.modifiers.map((modifier, modifierIndex) => (
                <div
                  className="flex items-center justify-between text-gray-800 my-2 ml-4"
                  key={modifierIndex}
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-slate-300 p-3 m-0 rounded-full text-center inline-block w-4 h-4 flex items-center justify-center">
                      {modifier.quantity}
                    </span>
                    {modifier.modifierItemName}
                  </span>
                  <h2>${modifier.modifierPrice}</h2>
                </div>
              ))}
            </div>
          ))}

        <div className="py-3 flex flex-col gap-2">
          <div className="flex justify-between ">
            <p>Items</p>
            <p>${calculateSubtotal().toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${calculateSubtotal().toFixed(2)}</p>
          </div>
          {/* only show fees if there are items */}
          {cartItems?.length > 0 && (
            <>
              {orderType === "delivery" && (
                <div className="flex justify-between">
                  <p>Delivery Fee</p>
                  <p>${deliveryFee}</p>
                </div>
              )}

              {charges?.map((data, index) => (
                <div className="flex justify-between" key={index}>
                  <p>
                    {data.name} (
                    {data.chargesType && (
                      <span className="text-sm text-gray-500">
                        {data.chargesType === "DISCOUNT" && "Discount"}
                        {data.chargesType === "SERVICE" && "Service Charge"}
                        {data.chargesType === "TAXES" && "Tax"}
                      </span>
                    )}
                    )
                  </p>
                  <p>${calculateChargeAmount(data).toFixed(2)}</p>
                </div>
              ))}
            </>
          )}
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>${totalCartValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
