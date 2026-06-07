import cron from "node-cron";
import { expirePendingBookings } from "./expiredPendingBookings.js";

cron.schedule("* * * * *", async () => {
  await expirePendingBookings();
});

console.log("🕒 Booking expiration job started");