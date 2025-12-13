import { Request, Response } from 'express';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { trailers } from '../data/trailers';

// ============================================
// DASHBOARD STATS
// ============================================

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalTrailers = trailers.length;

    // This month's stats
    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const revenueThisMonth = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Last month's stats for comparison
    const bookingsLastMonth = await Booking.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const revenueLastMonth = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Total revenue
    const totalRevenue = await Booking.aggregate([
      {
        $match: { paymentStatus: 'paid' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Pending bookings
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Active rentals
    const activeRentals = await Booking.countDocuments({ status: 'active' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Booking status breakdown
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalTrailers,
        totalRevenue: totalRevenue[0]?.total || 0,
        bookingsThisMonth,
        revenueThisMonth: revenueThisMonth[0]?.total || 0,
        bookingsLastMonth,
        revenueLastMonth: revenueLastMonth[0]?.total || 0,
        pendingBookings,
        activeRentals,
        recentBookings,
        bookingsByStatus
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.suspended = false;
    } else if (status === 'inactive') {
      query.suspended = true;
    }

    const users = await User.find(query)
      .select('-password -refreshToken -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -refreshToken -verificationToken -resetPasswordToken')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's bookings
    const bookings = await Booking.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      user,
      bookings
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive, isVerified } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.suspended = !isActive;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: !user.suspended,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't delete, just deactivate (suspend)
    user.suspended = true;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// ============================================
// BOOKING MANAGEMENT
// ============================================
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, search } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { trailerTitle: { $regex: search, $options: 'i' } },
        { pickupLocation: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings'
    });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking'
    });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
};

// ============================================
// TRAILER MANAGEMENT (for future database-backed trailers)
// ============================================
export const getAllTrailers = async (req: Request, res: Response) => {
  try {
    // For now, return from static data
    // Later, this will be from database
    res.json({
      success: true,
      trailers,
      total: trailers.length
    });
  } catch (error) {
    console.error('Get trailers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trailers'
    });
  }
};

// ============================================
// REPORTS
// ============================================
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage: any = { paymentStatus: 'paid' };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // Revenue by day
    const dailyRevenue = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue by trailer type
    const revenueByTrailer = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$trailerTitle',
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Revenue by location
    const revenueByLocation = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$pickupLocation',
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      report: {
        dailyRevenue,
        revenueByTrailer,
        revenueByLocation
      }
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate revenue report'
    });
  }
};

// Make user admin (for initial setup)
export const makeAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = 'admin';
    await user.save();

    res.json({
      success: true,
      message: `${user.email} is now an admin`
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to make user admin'
    });
  }
};
