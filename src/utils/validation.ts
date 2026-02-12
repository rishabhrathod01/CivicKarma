import { z } from 'zod';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

/**
 * Validates an Indian phone number.
 * Accepts 10-digit numbers optionally prefixed with +91 or 91.
 * @example "+919876543210", "919876543210", "9876543210"
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^(\+?91)?[6-9]\d{9}$/,
    'Enter a valid 10-digit Indian mobile number',
  );

/**
 * Validates a 6-digit OTP.
 */
export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

/**
 * Validates a complaint report draft (multi-step form).
 */
export const reportSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().nullable(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
  photos: z
    .array(z.string().min(1))
    .min(1, 'At least one photo is required'),
  latitude: z
    .number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  address: z.string().nullable(),
});

/**
 * Validates a profile update payload.
 */
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  ward: z.string().trim().optional(),
});

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type PhoneInput = z.infer<typeof phoneSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
