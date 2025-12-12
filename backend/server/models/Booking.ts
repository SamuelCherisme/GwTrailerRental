import mongoose from 'mongoose';

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  trailer: number;
  trailerTitle: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropoffLocation: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    trailer: {
      type: Number,
      required: [true, 'Trailer ID is required']
    },
    trailerTitle: {
      type: String,
      required: [true, 'Trailer title is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending'
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required']
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Dropoff location is required']
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ trailer: 1, startDate: 1, endDate: 1 });

// Check for overlapping bookings
bookingSchema.statics.checkAvailability = async function (
  trailerId: number,
  startDate: Date,
  endDate: Date,
  excludeBookingId?: mongoose.Types.ObjectId
) {
  const query: any = {
    trailer: trailerId,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return !conflictingBooking;
};

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
