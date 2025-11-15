// validators/bookingValidator.js
import { body } from "express-validator";

export const bookingValidationRules = [
  body("car")
    .notEmpty().withMessage("Car ID is required")
    .isMongoId().withMessage("Invalid Car ID"),

  body("pickupLocation")
    .trim()
    .notEmpty().withMessage("Pickup location is required"),

  body("dropoffLocation")
    .trim()
    .notEmpty().withMessage("Dropoff location is required")
    .custom((value, { req }) => {
      if (value === req.body.pickupLocation) {
        throw new Error("Pickup and dropoff cannot be the same");
      }
      return true;
    }),

  body("pickupDate")
    .notEmpty().withMessage("Pickup date is required")
    .isISO8601().withMessage("Pickup date must be a valid date"),

  body("dropoffDate")
    .notEmpty().withMessage("Dropoff date is required")
    .isISO8601().withMessage("Dropoff date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.pickupDate)) {
        throw new Error("Dropoff date must be after pickup date");
      }
      return true;
    }),
];
