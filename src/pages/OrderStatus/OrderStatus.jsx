import React from "react";
import { useNavigate } from "react-router-dom";
const OrderStatus = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook

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
        You can find your order number in the e-mail we've sent to you.
      </p>

      {/* Search Input */}
      <div className="flex items-center border rounded-lg px-3 py-2 mb-6 shadow-sm bg-white w-full max-w-xs">
        <input
          type="text"
          placeholder="Order Number"
          className="w-full outline-none text-gray-600"
          defaultValue="1005"
        />
        <span className="text-gray-400">
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
        </span>
      </div>

      {/* Order Number Display */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg px-8 py-4 mb-6 text-center shadow-md">
        <p className="text-gray-500 text-sm">Order Number:</p>
        <p className="text-4xl font-bold text-purple-500 mt-1">1005</p>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        {/* Order Status Item */}
        <div className="flex items-start mb-4">
          <div className="rounded-full bg-purple-200 text-purple-500 p-2">
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
          <div className="ml-4">
            <p className="font-semibold text-gray-600">Order Received</p>
            <p className="text-gray-400 text-xs">15.12.2024 17:53:11</p>
          </div>
        </div>

        {/* Other Status Items */}
        {[
          "Confirmed",
          "Preparing",
          "Ready",
          "On delivery",
          "Delivered",
        ].map((status, index) => (
          <div className="flex items-start mb-4" key={index}>
            <div className="rounded-full border-2 border-purple-200 p-2 text-purple-300">
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
            <div className="ml-4">
              <p className="font-semibold text-gray-400">{status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;
