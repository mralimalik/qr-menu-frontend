import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { VenueContext } from "../../context/VenueContext";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const Checkout = () => {
  const navigate = useNavigate();
  const { venueId, menuId } = useParams();
  const {
    cartItems,
    setCartItems,
    isCartButtonVisible,
    appliedCharges,
    setAppliedCharges,
    calculateTotalCartValue,
    calculateDeliveryFee,
    createOrder,
  } = useContext(CartContext);

  const { charges, orderSettings, orderType, tableData, venueData ,selectedMenu} =
    useContext(VenueContext);

  // to set total cart value
  const [totalCartValue, setTotalCartValue] = useState(0);

  // to show delivery fee
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    setDeliveryFee(calculateDeliveryFee(orderType, orderSettings));
  }, [orderSettings, orderType]);

  useEffect(() => {
    if (cartItems?.length > 0) {
      setTotalCartValue(
        calculateTotalCartValue(charges, orderType, orderSettings)
      );
      console.log("Cart items", cartItems);
    } else {
      setTotalCartValue(0);
    }
  }, [cartItems, deliveryFee, charges, orderType]);

  const [loading, setLoading] = useState(false);
  const handleCheckout = async() => {
    try {
      setLoading(true);
      if (cartItems && cartItems.length > 0 && venueId && menuId) {
        createOrder(venueData._id, tableData.tableName, "");
        navigate(`/${venueId}/menu/${menuId}/checkout`);
      } else {
        console.log("Cart is empty or missing venueId/menuId");
      }
      setLoading(false);
    } catch (e) {
      console.log("error creating order",e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100">
      <div className="pb-20 overflow-y-auto ">
        <header className="flex justify-center items-center  bg-violet-400 py-2 text-white px-4 w-full">
          {/* <button>&larr;</button> */}
          <h1 className="text-xl font-bold">Checkout</h1>
        </header>

        <OrderSummary
          deliveryFee={deliveryFee}
          totalCartValue={totalCartValue}
        />
        {/* cart item list */}
        <div className=" m-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold">
            Payment Method: <span className="font-normal">Cash</span>
          </h3>
        </div>

        {/* total price div */}
      </div>
      {isCartButtonVisible(orderType, orderSettings,selectedMenu?.orderSettings) && (
        <div
          className="px-4 py-2 bg-white fixed bottom-0 w-full cursor-pointer"
          onClick={handleCheckout}
        >
          <button
            className={`${
              cartItems?.length === 0 ? "bg-purple-200" : "bg-purple-500"
            } text-white w-[400px] py-2 rounded-lg font-semibold`}
          >
            {!loading ? (
              <>Checkout (${totalCartValue.toFixed(2)})</>
            ) : (
              "Processing...."
            )}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Checkout;

export const OrderSummary = ({ deliveryFee, totalCartValue }) => {
  const { cartItems, calculateSubtotal } = useContext(CartContext);

  const { charges, orderSettings, orderType, tableData } =
    useContext(VenueContext);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

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
