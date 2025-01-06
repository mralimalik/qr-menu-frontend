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
  // to set total cart value
  const [totalCartValue, setTotalCartValue] = useState(0);

  // to show delivery fee
  const [deliveryFee, setDeliveryFee] = useState(0);
  // show loading when paying
  const [loading, setLoading] = useState(false);
  // to show card payment sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  // to select payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // to navigate to other route
  const navigate = useNavigate();
  // to get venue and menu id from params
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

  // handle payment
  const handleCheckout = async () => {
    try {
      setLoading(true);
      if (cartItems && cartItems.length > 0 && venueId && menuId) {
        if (selectedPaymentMethod === "CARD") {
          setIsBottomSheetOpen(true);
        } else if (selectedPaymentMethod === "CASH") {
          await createOrder(
            venueData._id,
            tableData.tableName,
            "",
            selectedPaymentMethod,
            totalCartValue,
            {}
          );
        } else {
          toast.error("Please select a payment method");
        }
      } else {
        console.log("Cart is empty or missing venueId/menuId");
      }
    } catch (e) {
      console.log("error creating order", e);
    } finally {
      setLoading(false);
    }
  };

  // // handle card payment
  const handleCardPayment = async (cardDetails) => {
    try {
      setLoading(true);

      await createOrder(
        venueData._id,
        tableData.tableName,
        "",
        selectedPaymentMethod,
        totalCartValue,
        cardDetails
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);

      setIsBottomSheetOpen(false);
    }
  };

  const paymentOptions = [
    {
      value: "CASH",
      label: "Pay with Cash",
      enabled:
        orderSettings?.settings.dineIn?.paymentEnabled &&
        orderSettings?.settings.dineIn?.paymentOptions?.cashPayment,
    },
    {
      value: "CARD",
      label: "Pay with Card",
      enabled:
        orderSettings?.settings.dineIn?.paymentEnabled &&
        orderSettings?.settings.dineIn?.paymentOptions?.cardPayment,
    },
  ];

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
          // onClick={handleCheckout}
        >
          <button
            onClick={!loading ? handleCheckout : undefined}
            disabled={loading}
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
        loading={loading}
      />
      <ToastContainer />
    </div>
  );
};

export default Checkout;
