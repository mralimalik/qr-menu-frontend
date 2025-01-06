import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiurl } from "../../constants/apiconst.js";
import "./OrderStatus.css";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator.jsx";
const OrderStatus = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({});
  const [inputOrderId, setInputOrderId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const getOrderDetails = async () => {
    try {
      if (!orderId) return;
      console.log("getting now");
      setLoading(true);
      const url = `${apiurl}order/${orderId}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setOrderData(response.data.data);
        console.log(response.data.data);
      }
    } catch (e) {
      console.log("error getting order details", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (inputOrderId && inputOrderId !== orderId) {
      setOrderId(inputOrderId);
    } else if (inputOrderId === orderId) {
      await getOrderDetails();
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  const dineInTimeline = [
    { label: "Order Received", value: "WAITING" },
    { label: "Confirmed", value: "INKITCHEN" },
    { label: "Preparing", value: "DELIVERY" },
    { label: "Ready", value: "COMPLETED" },
  ];
  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="self-start text-gray-500 hover:text-gray-700 mb-4"
      >
        &#8592; Back
      </button>
      {/* Order Status Title */}
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-2">
        Order Status
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        {/* You can find your order number in the e-mail we've sent to you. */}
      </p>

      {/* Search Input */}
      <div className="flex items-center border rounded-lg px-3 py-2 mb-6 shadow-sm bg-white w-full max-w-xs">
        <input
          type="number"
          placeholder="Order Number"
          className="w-full outline-none text-gray-600 order-text-field"
          value={inputOrderId}
          onChange={(e) => setInputOrderId(e.target.value)} // Update input value
        />
        <button
          onClick={handleSearch} // Trigger search
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.7-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {orderData && Object.keys(orderData).length > 0 && (
        <div>
          {/* Order Number Display */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg px-8 py-4 mb-6 text-center shadow-md">
            <p className="text-gray-500 text-sm">Order Number:</p>
            <p className="text-4xl font-bold text-purple-500 mt-1">
              {orderData?.orderId}
            </p>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
            {orderData?.status === "CANCELLED" && (
              <OrderTimeline status={"Cancelled"} isActive={true} />
            )}

            {orderData?.status === "REFUNDED" && (
              <OrderTimeline status={"Refunded"} isActive={true} />
            )}

            {/* Other Status Items */}
            {orderData?.status !== "CANCELLED" &&
              orderData?.status !== "REFUNDED" &&
              dineInTimeline.map((status, index) => {
                const isActive =
                  index <=
                  dineInTimeline.findIndex(
                    (item) => item.value === orderData.status
                  );
                return (
                  <div key={index} className="">
                    <OrderTimeline
                      status={status.label}
                      isActive={isActive}
                      showLine={index < dineInTimeline.length - 1} // Show line except for the last item
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <LoadingIndicator loading={loading} />
    </div>
  );
};

export default OrderStatus;

const OrderTimeline = ({ status, isActive, showLine }) => {
  return (
    <div className="flex items-start">
      {/* Timeline Icon and Line */}
      <div className="flex flex-col items-center">
        {/* Icon */}
        <div
          className={`rounded-full border-2 p-2 ${
            isActive
              ? "border-purple-500 text-purple-500"
              : "border-gray-300 text-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {/* Connecting Line */}
        {showLine && (
          <div
            className={`w-0.5 h-6 ${
              isActive ? "bg-purple-500" : "bg-gray-300"
            }`}
          ></div>
        )}
      </div>

      {/* Label */}
      <div className="ml-4 mt-2">
        <p
          className={`font-semibold ${
            isActive ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
};
