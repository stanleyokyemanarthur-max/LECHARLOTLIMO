export function findPaidBooking(bookings, bookingId) {
  if (!Array.isArray(bookings) || !bookingId) return null;

  return (
    bookings.find(
      (booking) =>
        booking?._id === bookingId && booking.paymentStatus === "paid",
    ) || null
  );
}
