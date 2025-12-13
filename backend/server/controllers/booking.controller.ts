import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import mongoose from 'mongoose';
import { trailers, getTrailerById } from '../data/trailers';

// CREATE BOOKING
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { trailerId, startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

    // Validate required fields
    if (!trailerId || !startDate || !endDate || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide trailerId, startDate, endDate, and pickupLocation'
      });
    }

    // Get trailer info
    const trailer = getTrailerById(Number(trailerId));
    if (!trailer) {
      return res.status(404).json({
        success: false,
        message: 'Trailer not found'
      });
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate dates
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Calculate days and price
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * trailer.price;

    // Check availability
    const isAvailable = await (Booking as any).checkAvailability(trailer.id, start, end);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'Trailer is not available for the selected dates'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      trailer: trailer.id,
      trailerTitle: trailer.name,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: trailer.price,
      totalPrice,
      pickupLocation,
      dropoffLocation: dropoffLocation || pickupLocation,
      notes,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        trailer: {
          id: trailer.id,
          title: trailer.name,
          type: trailer.type
        },
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalDays: booking.totalDays,
        pricePerDay: booking.pricePerDay,
        totalPrice: booking.totalPrice,
        status: booking.status,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation
      }
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking'
    });
  }
};

// GET USER'S BOOKINGS
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status } = req.query;

    const query: any = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Add trailer details to each booking
    const bookingsWithDetails = bookings.map(booking => {
      const trailer = getTrailerById(booking.trailer);
      return {
        ...booking,
        trailerDetails: trailer || null
      };
    });

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookingsWithDetails
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching bookings'
    });
  }
};

// GET SINGLE BOOKING
export const getBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findOne({ _id: id, user: userId }).lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const trailer = getTrailerById(booking.trailer);

    res.json({
      success: true,
      booking: {
        ...booking,
        trailerDetails: trailer || null
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the booking'
    });
  }
};

// CANCEL BOOKING
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findOne({ _id: id, user: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    if (booking.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an active rental. Please contact support.'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling the booking'
    });
  }
};

// CHECK TRAILER AVAILABILITY
export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { trailerId, startDate, endDate } = req.query;

    if (!trailerId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide trailerId, startDate, and endDate'
      });
    }

    const trailer = getTrailerById(Number(trailerId));
    if (!trailer) {
      return res.status(404).json({
        success: false,
        message: 'Trailer not found'
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const isAvailable = await (Booking as any).checkAvailability(trailer.id, start, end);

    // Get booked dates for this trailer
    const existingBookings = await Booking.find({
      trailer: trailer.id,
      status: { $nin: ['cancelled', 'completed'] },
      endDate: { $gte: new Date() }
    }).select('startDate endDate').lean();

    res.json({
      success: true,
      available: isAvailable,
      trailer: {
        id: trailer.id,
        title: trailer.name,
        pricePerDay: trailer.price
      },
      bookedDates: existingBookings.map(b => ({
        start: b.startDate,
        end: b.endDate
      }))
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking availability'
    });
  }
};

// GET UNAVAILABLE DATES FOR A TRAILER
export const getUnavailableDates = async (req: Request, res: Response) => {
  try {
    const { trailerId } = req.params;

    const trailer = getTrailerById(Number(trailerId));
    if (!trailer) {
      return res.status(404).json({
        success: false,
        message: 'Trailer not found'
      });
    }

    const bookings = await Booking.find({
      trailer: trailer.id,
      status: { $nin: ['cancelled', 'completed'] },
      endDate: { $gte: new Date() }
    }).select('startDate endDate').lean();

    // Generate array of unavailable dates
    const unavailableDates: string[] = [];

    bookings.forEach(booking => {
      const current = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      while (current <= end) {
        unavailableDates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    res.json({
      success: true,
      trailerId: trailer.id,
      unavailableDates: [...new Set(unavailableDates)] // Remove duplicates
    });
  } catch (error) {
    console.error('Get unavailable dates error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching unavailable dates'
    });
  }
};
