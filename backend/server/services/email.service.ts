import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Base email sender
const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'GW Rentals <onboarding@resend.dev>', // Use your domain after verifying in Resend
      to: options.to,
      subject: options.subject,
      html: options.html
    });

    if (error) {
      console.error('Email error:', error);
      return false;
    }

    console.log('Email sent:', data);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<boolean> => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #fef9f3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #d63031, #b71c1c); color: white; font-weight: bold; font-size: 20px; padding: 12px 16px; border-radius: 12px;">GW</div>
          </div>

          <!-- Content -->
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0 0 16px; text-align: center;">Verify Your Email</h1>

          <p style="color: #636e72; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${name},
          </p>

          <p style="color: #636e72; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            Thanks for signing up for GW Rentals! Please verify your email address by clicking the button below.
          </p>

          <!-- Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #d63031, #b71c1c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
          </div>

          <p style="color: #b2bec3; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>

          <p style="color: #b2bec3; font-size: 14px; line-height: 1.6; margin: 0;">
            Or copy and paste this URL into your browser:<br>
            <a href="${verificationUrl}" style="color: #d63031; word-break: break-all;">${verificationUrl}</a>
          </p>

        </div>

        <!-- Footer -->
        <p style="text-align: center; color: #b2bec3; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} GW Rentals. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your email - GW Rentals',
    html
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, name: string, token: string): Promise<boolean> => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #fef9f3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #d63031, #b71c1c); color: white; font-weight: bold; font-size: 20px; padding: 12px 16px; border-radius: 12px;">GW</div>
          </div>

          <!-- Content -->
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0 0 16px; text-align: center;">Reset Your Password</h1>

          <p style="color: #636e72; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${name},
          </p>

          <p style="color: #636e72; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>

          <!-- Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #d63031, #b71c1c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <p style="color: #b2bec3; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>

          <p style="color: #b2bec3; font-size: 14px; line-height: 1.6; margin: 0;">
            Or copy and paste this URL into your browser:<br>
            <a href="${resetUrl}" style="color: #d63031; word-break: break-all;">${resetUrl}</a>
          </p>

        </div>

        <!-- Footer -->
        <p style="text-align: center; color: #b2bec3; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} GW Rentals. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your password - GW Rentals',
    html
  });
};

// Send welcome email (after verification)
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #fef9f3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #d63031, #b71c1c); color: white; font-weight: bold; font-size: 20px; padding: 12px 16px; border-radius: 12px;">GW</div>
          </div>

          <!-- Content -->
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0 0 16px; text-align: center;">Welcome to GW Rentals! 🎉</h1>

          <p style="color: #636e72; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${name},
          </p>

          <p style="color: #636e72; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            Your email has been verified and your account is now active. You're all set to start renting trailers!
          </p>

          <!-- Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${FRONTEND_URL}/trailers" style="display: inline-block; background: linear-gradient(135deg, #d63031, #b71c1c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Browse Trailers
            </a>
          </div>

          <p style="color: #636e72; font-size: 14px; line-height: 1.6; margin: 0;">
            If you have any questions, feel free to reach out to our support team.
          </p>

        </div>

        <!-- Footer -->
        <p style="text-align: center; color: #b2bec3; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} GW Rentals. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to GW Rentals!',
    html
  });
};
