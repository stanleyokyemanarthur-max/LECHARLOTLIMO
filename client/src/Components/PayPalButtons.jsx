import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { API_ORIGIN } from "../config/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PayPalButton({
  amount,
  bookingId,
  token,
  onAuthExpired,
}) {
  const navigate = useNavigate();

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return (
    <PayPalButtons
      fundingSource={FUNDING.PAYPAL}
      style={{
        layout: "vertical",
        label: "paypal",
        color: "gold",
        shape: "rect",
        height: 50,
      }}
      createOrder={async () => {
        try {
          const res = await axios.post(
            `${API_ORIGIN}/api/paypal/create-order`,
            { bookingId, amount },
            { headers },
          );
          return res.data.id;
        } catch (error) {
          if (error.response?.status === 401) onAuthExpired?.();
          throw error;
        }
      }}
      onApprove={async (data) => {
        try {
          const res = await axios.post(
            `${API_ORIGIN}/api/paypal/capture-order`,
            {
              orderID: data.orderID,
              bookingId,
            },
            { headers }
          );

          if (res.data.success) {
            navigate(
              `/booking-success?source=paypal&bookingId=${encodeURIComponent(bookingId)}`,
              { replace: true },
            );
          }
        } catch (err) {
          console.error("Capture failed:", err);
          if (err.response?.status === 401) onAuthExpired?.();
        }
      }}
    />
  );
}