import React from "react";

const PaymentMethodSelector = ({ selectedMethod, onChange, options }) => {
  return (
    <div className="flex  justify-center items-center gap-3 my-1">
      {options.map((option) => (
        <div
          key={option.value}
          className={`w-full p-4 border rounded-lg cursor-pointer ${
            selectedMethod === option.value
              ? "border-violet-600"
              : "border-gray-300"
          } ${!option.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => option.enabled && onChange(option.value)}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === option.value}
            onChange={() => onChange(option.value)}
            disabled={!option.enabled}
          />
          <label className="ml-2">{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
