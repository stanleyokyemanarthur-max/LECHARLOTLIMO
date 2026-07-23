import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // =========================
    // CUSTOMER
    // =========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =========================
    // DRIVER
    // =========================

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    driverStatus: {
      type: String,
      enum: [
        "unassigned",
        "assigned",
        "picked_up",
        "enroute",
        "completed",
      ],
      default: "unassigned",
    },

    // =========================
    // VEHICLE
    // =========================

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },

    carSnapshot: {
      name: String,
      category: String,
      image: String,

      pricePerMile: {
        type: Number,
        required: true,
      },

      rateMultiplier: {
        type: Number,
        default: 1,
      },

      totalUnits: {
        type: Number,
        default: 1,
      },

      fleetKey: {
        type: String,
        required: true,
        index: true,
      },
    },

    // =========================
    // TRIP DETAILS
    // =========================

    tripType: {
      type: String,
      enum: ["oneWay", "roundTrip"],
      default: "oneWay",
      index: true,
    },

    pickupLocation: {
      type: String,
      required: true,
    },

    dropoffLocation: {
      type: String,
      required: true,
    },

    pickupDate: {
      type: Date,
      required: true,
      index: true,
    },

    dropoffDate: {
      type: Date,
      required: true,
      index: true,
    },

    // outbound flight
    flightNumber: {
      type: String,
      default: null,
    },

    passengers: {
      type: Number,
      default: 1,
    },

    luggage: {
      type: Number,
      default: 0,
    },

    distance: {
      type: Number,
      required: true,
    },

    totalDistance: {
      type: Number,
      default: 0,
    },

    returnDistance: {
      type: Number,
      default: 0,
    },

    // =========================
    // ROUND TRIP
    // =========================

    returnTrip: {
      pickupLocation: {
        type: String,
        default: null,
      },

      dropoffLocation: {
        type: String,
        default: null,
      },

      pickupDate: {
        type: Date,
        default: null,
      },

      dropoffDate: {
        type: Date,
        default: null,
      },
      pickupIsAirport: {
        type: Boolean,
        default: false,
      },

      dropoffIsAirport: {
        type: Boolean,
        default: false,
      },

      distance: {
        type: Number,
        default: 0,
      },

      flightNumber: {
        type: String,
        default: null,
      },
    },

    // =========================
    // PRICING
    // =========================

    totalPrice: {
      type: Number,
      default: null,
    },

    pricing: {
      outboundFare: {
        type: Number,
        default: 0,
      },

      returnFare: {
        type: Number,
        default: 0,
      },

      outboundDistance: {
        type: Number,
        default: 0,
      },

      returnDistance: {
        type: Number,
        default: 0,
      },
    },

    pricingLocked: {
      type: Boolean,
      default: false,
    },

    // =========================
    // PAYMENT
    // =========================

    paymentStatus: {
      type: String,
      enum: [
        "unquoted",
        "quoted",
        "awaiting_payment",
        "processing",
        "paid",
        "failed",
        "refunded",
        "cancelled",
        "expired",
      ],
      default: "unquoted",
      index: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },

    // =========================
    // REWARDS
    // =========================

    freeReason: {
      type: String,
      enum: ["reward", "admin", null],
      default: null,
    },

    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      default: null,
    },

    // =========================
    // AVAILABILITY
    // =========================

    fleetKey: {
      type: String,
      required: true,
      index: true,
    },

    // =========================
    // BOOKING STATUS
    // =========================

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "enroute",
        "completed",
        "cancelled",
        "expired",
      ],
      default: "pending",
      index: true,
    },

    // =========================
    // NOTIFICATIONS
    // =========================

    notificationFlags: {
      bookingConfirmedNotifiedUser: {
        type: Boolean,
        default: false,
      },

      enrouteNotifiedUser: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ===================================
// PERFORMANCE INDEXES
// ===================================

bookingSchema.index({
  status: 1,
  pickupDate: 1,
  dropoffDate: 1,
});

bookingSchema.index({
  status: 1,
  "returnTrip.pickupDate": 1,
  "returnTrip.dropoffDate": 1,
});

const Booking =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);

export default Booking;