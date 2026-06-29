import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PayPalButton({ amount, bookingId, token }) {
  const navigate = useNavigate();

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return (
    <PayPalButtons
      createOrder={async () => {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/paypal/create-order`,
          { bookingId, amount },
          { headers }
        );

        return res.data.id;
      }}

      onApprove={async (data) => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/paypal/capture-order`,
            {
              orderID: data.orderID,
              bookingId,
            },
            { headers }
          );

          if (res.data.success) {
            navigate("/booking-success?source=paypal", { replace: true });
          }
        } catch (err) {
          console.error("Capture failed:", err);
        }
      }}
    />
  );
}