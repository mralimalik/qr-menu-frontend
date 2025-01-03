// import React, { useEffect, useRef } from "react";
// import "./MoyassarPayment.css";

// const Payment = ({ amount, currency, description }) => {
//   const paymentElementRef = useRef(null);

//   useEffect(() => {
//     if (paymentElementRef.current && window.Moyasar) {
//       window.Moyasar.init({
//         element: paymentElementRef.current,
//         amount: amount * 100, // Amount in the smallest currency unit (e.g., cents)
//         currency: currency,
//         description: description,
//         publishable_api_key: "pk_test_XVHw4DAsuvLNGUAaDN98CxL8B1rDjhB6euTv8Bfz",
//         callback_url: "https://enterprisemobility.ae",
//         methods: ["creditcard"],
//         on_completed: (payment) => {
//           console.log("Payment completed:", payment);
//         },
//         on_failed: (error) => {
//           console.error("Payment failed:", error);
//         },
//       });
//     }
//   }, [amount, currency, description]);

//   return (
//     <div
//       ref={paymentElementRef}
//       id="moyasar-payment"
//       style={{
//         padding: "10px",
//         border: "1px solid #ccc",
//         borderRadius: "10px",
//         backgroundColor: "#f9f9f9",
//       }}
//     ></div>
//   );
// };

// export default Payment;
