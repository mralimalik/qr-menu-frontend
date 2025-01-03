import React, { useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

export const CardPaymentSheet = ({ isOpen, onDismiss, handleCardPayment }) => {
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCardPayment(cardDetails);
  };

  return (
    <BottomSheet open={isOpen} onDismiss={onDismiss}>
      <div className="p-4 max-w-md">
        <h2 className="text-lg font-bold mb-4">Enter Card Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name on Card</label>
            <input
              type="text"
              name="name"
              value={cardDetails.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Card Number</label>
            <input
              type="text"
              name="number"
              value={cardDetails.number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="4111 1111 1111 1111"
            />
          </div>
          <div className="flex mb-4">
            <div className="w-1/2 mr-2">
              <label className="block text-gray-700">Expiry Month</label>
              <input
                type="text"
                name="exp_month"
                value={cardDetails.exp_month}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="12"
              />
            </div>
            <div className="w-1/2 ml-2">
              <label className="block text-gray-700">Expiry Year</label>
              <input
                type="text"
                name="exp_year"
                value={cardDetails.exp_year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="2025"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CVC</label>
            <input
              type="text"
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold"
          >
            Pay Now
          </button>
        </form>
      </div>
    </BottomSheet>
  );
};
