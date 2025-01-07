import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { apiurl } from "../../constants/apiconst.js";
import { toast } from "react-toastify";
const PaymentStatusPage = () => {
  // get the moyassar key
  const { moyassarKey } = useContext(CartContext);

  // store payment data
  const [paymentData, setPaymentData] = useState(null);
  // loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // get venue menu from params,
  const { venueId, menuId } = useParams();
  //  location for link
  const location = useLocation();
  // for navigation
  const navigate = useNavigate();

  // Extract query parameters from location.search
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get("id");

  // update the payment status in backend order
  const updatePaymentStatus = async (paymentId, status) => {
    try {
      const response = await axios.put(
        `${apiurl}order/paymentstatus/${paymentId}`,
        { status }
      );
      if (response.status === 200) {
        const orderId = response.data.data._id;
        navigate(`/${venueId}/menu/${menuId}/order-summary/${orderId}`, {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  // get the status of payment from moyassar api 
  const getPaymentStatusFromMoyassar = async () => {
    try {
      const apiKey = moyassarKey();
      const response = await axios.get(
        `https://api.moyasar.com/v1/payments/${id}`,
        {
          headers: {
            Authorization: `Basic ${apiKey}`,
          },
        }
      );

      const status = response.data.status;
      

      if (status !== "paid") {
        toast.success("Order created successfully");
      } else {
        toast.error("Order creating order");
        navigate(`/${venueId}/menu/${menuId}`, {
          replace: true,
        });
      }

      // Update payment status in your system
      await updatePaymentStatus(id, status);

      setPaymentData(response.data);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError("Failed to fetch payment details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPaymentStatusFromMoyassar();
    } else {
      setError("Payment ID is missing.");
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-xl font-semibold text-gray-800">Payment Status</h1>
        {loading ? (
          <p className="mt-4 text-gray-600">Loading...</p>
        ) : error ? (
          <p className="mt-4 text-red-600">{error}</p>
        ) : (
          <>
            <p className="mt-4 text-gray-600">
              <strong>Order ID:</strong> {paymentData.id}
            </p>
            <p className="mt-4 text-gray-600">
              <strong>Status:</strong> {paymentData.status}
            </p>
            <p className="mt-4 text-gray-600">
              <strong>Amount:</strong> {paymentData.amount_format}
            </p>
            <p className="mt-4 text-gray-600">
              <strong>Currency:</strong> {paymentData.currency}
            </p>
            <p className="mt-4 text-gray-600">
              <strong>Payment Method:</strong> {paymentData.source.type}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusPage;
