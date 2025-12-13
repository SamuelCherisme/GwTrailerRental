// server/controllers/payment.controller.ts

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Booking } from '../models/Booking';
import { getTrailerById } from '../data/trailers';

// Initialize Stripe lazily to ensure env vars are loaded
let stripe: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// CREATE CHECKOUT SESSION
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const stripeClient = getStripe();
    const userId = (req as any).user.userId;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Get the booking
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not pending payment'
      });
    }

    // Get trailer details
    const trailer = getTrailerById(booking.trailer);

    // Create Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: (req as any).user.email,
      metadata: {
        bookingId: booking._id.toString(),
        userId: userId,
        trailerId: booking.trailer.toString()
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: trailer?.name || booking.trailerTitle,
              description: `${booking.totalDays} day rental (${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()})`,
              images: trailer?.imageUrl ? [trailer.imageUrl] : []
            },
            unit_amount: Math.round(booking.totalPrice * 100) // Stripe uses cents
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled?booking_id=${booking._id}`
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
};

// VERIFY PAYMENT (called after successful checkout)
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const stripeClient = getStripe();
    const { sessionId, bookingId } = req.body;

    if (!sessionId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and Booking ID are required'
      });
    }

    // Retrieve the session from Stripe
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Update booking status
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'confirmed';
    (booking as any).paymentId = session.payment_intent;
    (booking as any).paidAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      booking: {
        id: booking._id,
        status: booking.status,
        totalPrice: booking.totalPrice
      }
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
};

// STRIPE WEBHOOK (for automatic payment confirmation)
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    const stripeClient = getStripe();
    if (webhookSecret) {
      event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update booking status
      if (session.metadata?.bookingId) {
        await Booking.findByIdAndUpdate(session.metadata.bookingId, {
          status: 'confirmed',
          paymentId: session.payment_intent,
          paidAt: new Date()
        });
        console.log(`Booking ${session.metadata.bookingId} confirmed via webhook`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// GET PAYMENT DETAILS
export const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const stripeClient = getStripe();
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      payment: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
        created: new Date(paymentIntent.created * 1000)
      }
    });
  } catch (error: any) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details'
    });
  }
};

// REFUND PAYMENT (Admin only)
export const refundPayment = async (req: Request, res: Response) => {
  try {
    const stripeClient = getStripe();
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!(booking as any).paymentId) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this booking'
      });
    }

    // Create refund
    const refund = await stripeClient.refunds.create({
      payment_intent: (booking as any).paymentId
    });

    // Update booking
    booking.status = 'cancelled';
    (booking as any).refundId = refund.id;
    (booking as any).refundedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error: any) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund'
    });
  }
};
