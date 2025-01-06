import React, { useEffect, useContext, useState } from "react";

import { useParams, useNavigate, replace } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator.jsx";

const OrderSummary = () => {
  const navigate = useNavigate();
  const { venueId, menuId, orderId } = useParams();
  const { getOrder, orderData } = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleOrderDataFetch = async () => {
    try {
      setLoading(true);
      await getOrder(orderId);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (orderId) {
      handleOrderDataFetch();
    }
  }, [orderId]);

  const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  useEffect(() => {
    if (orderData?.orderSummary) {
      const itemsTotal = orderData.orderSummary.reduce((total, item) => {
        return (
          total +
          item.itemPrice * item.quantity +
          item.modifiers?.reduce((modifierTotal, modifier) => {
            return (
              modifierTotal +
              modifier.modifierPrice * modifier.quantity * item.quantity
            );
          }, 0)
        );
      }, 0);

      const discount = orderData?.appliedCharges?.discount || 0;
      const tax = orderData?.appliedCharges?.tax || 0;
      const serviceCharge = orderData?.appliedCharges?.serviceCharge || 0;
      const deliveryFee = orderData?.appliedCharges?.delivery || 0;

      setItemsPrice(itemsTotal);
      setSubtotal(itemsTotal);
      setTotalAmount(itemsTotal - discount + tax + serviceCharge + deliveryFee);
    }
  }, [orderData]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "")
      .replace(" ", "-");
  };

  const handleMenuNavigation = () => {
    navigate(`/${venueId}/menu/${menuId}`, { replace: true });
  };
  const showPaymentMethod = (orderData) => {
    switch (orderData?.paymentMethod) {
      case "CARD":
        return "Card";
      default:
        return "Cash";
    }
  };
  return (
    <div className="w-full mb-3">
      <div className="h-[300px] bg-violet-400 flex flex-col justify-center px-3 w-full">
        <section className="flex text-center justify-center items-center flex-col gap-2 text-white ">
          <h3 className="font-bold text-2xl">Thanks for your order!</h3>
          <h3 className="font-medium text-lg">
            Your order was placed successfully. Check your email for your order
            confirmation.
          </h3>
        </section>
      </div>

      <div className="shadow-lg rounded-lg  bg-white p-4 m-3 flex flex-col gap-3">
        {/* Order Information Title */}
        <h4 className="text-gray-500 text-sm ">Order Information</h4>

        {/* Order Number */}
        <div className=" flex items-center justify-between">
          <strong className="text-gray-800">Order Number</strong>
          <div className="flex items-center">
            <span className=" font-bold text-black">#{orderData?.orderId}</span>
            <span className=" text-purple-400 cursor-pointer" title="Copy">
              {/* Copy icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V8l-6-6H6zM5 4a1 1 0 011-1h5v4a1 1 0 001 1h4v6a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm9.414 3L10 2.586V7h4.414z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Order Status Text */}
        <p className="text-gray-600">
          You can track your order status with the order number.
        </p>

        {/* Order Time */}
        <div>
          <p>
            <strong className="text-gray-800">Time:</strong>{" "}
            <span className="font-bold text-black">
              {formatDate(orderData?.createdAt || 0)}
            </span>
          </p>
        </div>
      </div>

      <div className=" m-3 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="font-semibold">
          Payment Method: <span className="font-normal">{showPaymentMethod(orderData)}</span>
        </h3>
      </div>
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
            orderData?.orderSummary?.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-gray-800 my-2">
                  <span className="flex items-center gap-2">
                    <span className="bg-slate-300 p-3 m-0 rounded-full text-center inline-block w-4 h-4 flex items-center justify-center">
                      {data.quantity}
                    </span>
                    {data.itemName}
                  </span>
                  <h2>${data.itemPrice.toFixed(2)}</h2>
                </div>
                {data?.modifiers?.map((modifier, modifierIndex) => (
                  <div
                    className="flex items-center justify-between text-gray-800 my-2 ml-4"
                    key={modifierIndex}
                  >
                    <span className="flex items-center gap-2">
                      <span className="bg-slate-300 p-3 m-0 rounded-full text-center inline-block w-4 h-4 flex items-center justify-center">
                        {modifier.quantity}
                      </span>
                      {modifier.modifierName}
                    </span>
                    <h2>${modifier.modifierPrice.toFixed(2)}</h2>
                  </div>
                ))}
              </div>
            ))}

          <div className="py-3 flex flex-col gap-2">
            <div className="flex justify-between ">
              <p>Items</p>
              <p>${itemsPrice.toFixed(2) || 0}</p>
            </div>
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2) || 0}</p>
            </div>
            {/* only show fees if there are items */}

            {orderData?.orderType === "DELIVERY" && (
              <div className="flex justify-between">
                <p>Delivery Fee</p>
                <p>${orderData?.appliedCharges.delivery.toFixed(2) || 0}</p>
              </div>
            )}

            <div className="flex justify-between">
              <p>{"Taxes"}</p>
              <p>${orderData?.appliedCharges.tax.toFixed(2) || 0}</p>
            </div>
            <div className="flex justify-between">
              <p>{"Service Charge"}</p>
              <p>${orderData?.appliedCharges.serviceCharge.toFixed(2) || 0}</p>
            </div>
            <div className="flex justify-between">
              <p>{"Discount"}</p>
              <p>${orderData?.appliedCharges.discount.toFixed(2) || 0}</p>
            </div>

            <div className="flex justify-between font-bold">
              <p>Total</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex justify-center w-full cursor-pointer"
        onClick={handleMenuNavigation}
      >
        <button
          className={`bg-purple-500 text-white  w-full py-2 mx-5 rounded-lg font-semibold`}
        >
          Go to Menu
        </button>
      </div>
      <LoadingIndicator loading={loading} />
    </div>
  );
};

export default OrderSummary;
