import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { VenueContext } from "../../context/VenueContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import { CardPaymentSheet } from "../../component/CardPaymentSheet/CardPaymentSheet";
import PaymentMethodSelector from "../../component/PaymentMethodSelector/PaymentMethodSelector";
import { OrderSummary } from "../../component/CheckoutOrderSummary/OrderSummary.jsx";
const Checkout = () => {
  const navigate = useNavigate();
  const { venueId, menuId } = useParams();
  const {
    cartItems,
    isCartButtonVisible,
    calculateTotalCartValue,
    calculateDeliveryFee,
    createOrder,
  } = useContext(CartContext);

  const {
    charges,
    orderSettings,
    orderType,
    tableData,
    venueData,
    selectedMenu,
  } = useContext(VenueContext);

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
  const handleCheckout = async () => {
    try {
      setLoading(true);
      if (cartItems && cartItems.length > 0 && venueId && menuId) {
        if (selectedPaymentMethod === "CARD") {
          setIsBottomSheetOpen(true);
        } else if (selectedPaymentMethod === "CASH") {
          createOrder(
            venueData._id,
            tableData.tableName,
            "",
            selectedPaymentMethod,
            totalCartValue,
            {}
          );
          navigate(`/${venueId}/menu/${menuId}/checkout`);
        } else {
          toast.error("Please select a payment method");
        }
      } else {
        console.log("Cart is empty or missing venueId/menuId");
      }
      setLoading(false);
    } catch (e) {
      console.log("error creating order", e);
    } finally {
      setLoading(false);
    }
  };

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleCardPayment = async (cardDetails) => {
    try {
     
        createOrder(
          venueData._id,
          tableData.tableName,
          "",
          selectedPaymentMethod,
          totalCartValue,
          cardDetails
        );
        navigate(`/${venueId}/menu/${menuId}/checkout`);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsBottomSheetOpen(false);
    }
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const paymentOptions = [
    {
      value: "CASH",
      label: "Pay with Cash",
      enabled: orderSettings?.paymentOptions?.cashPayment,
    },
    {
      value: "CARD",
      label: "Pay with Card",
      enabled: orderSettings?.paymentOptions?.cardPayment,
    },
  ];

  return (
    <div className="bg-slate-100">
      <div className="pb-20 overflow-y-auto ">
        <header className="flex justify-center items-center  bg-violet-400 py-2 text-white px-4 w-full">
          {/* <button>&larr;</button> */}
          <h1 className="text-xl font-bold">Checkout</h1>
        </header>
        {/* cart item list */}

        <OrderSummary
          deliveryFee={deliveryFee}
          totalCartValue={totalCartValue}
        />
        <div className="m-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold">Payment Method:</h3>
          <PaymentMethodSelector
            selectedMethod={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
            options={paymentOptions}
          />
        </div>

        {/* total price div */}
      </div>

      {isCartButtonVisible(
        orderType,
        orderSettings,
        selectedMenu?.orderSettings
      ) && (
        <div
          className="px-4 py-2 bg-white fixed bottom-0 w-full cursor-pointer"
          onClick={handleCheckout}
        >
          <button
            className={`${
              cartItems?.length === 0 ? "bg-purple-200" : "bg-purple-500"
            } text-white sm:w-[380px] w-full py-2 rounded-lg font-semibold`}
          >
            {!loading ? (
              <>Checkout (${totalCartValue.toFixed(2)})</>
            ) : (
              "Processing...."
            )}
          </button>
        </div>
      )}

      <CardPaymentSheet
        handleCardPayment={handleCardPayment}
        isOpen={isBottomSheetOpen}
        onDismiss={() => setIsBottomSheetOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default Checkout;
