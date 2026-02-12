import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ─── Formatting Utility Functions ────────────────────────────────────────────

/**
 * Format an ISO date string into a short date.
 * @example formatDate("2026-02-12T15:45:00Z") → "12 Feb 2026"
 */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'dd MMM yyyy');
}

/**
 * Format an ISO date string into date + time.
 * @example formatDateTime("2026-02-12T15:45:00Z") → "12 Feb 2026, 3:45 PM"
 */
export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), "dd MMM yyyy, h:mm a");
}

/**
 * Format an ISO date string into a human-readable relative time.
 * @example formatRelativeTime("2026-02-12T13:45:00Z") → "2 hours ago"
 */
export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

/**
 * Format a phone number into readable form with the +91 prefix.
 * Handles raw 10-digit numbers as well as numbers already prefixed.
 * @example formatPhoneNumber("9876543210") → "+91 98765 43210"
 * @example formatPhoneNumber("+919876543210") → "+91 98765 43210"
 */
export function formatPhoneNumber(phone: string): string {
  // Strip everything that's not a digit
  const digits = phone.replace(/\D/g, '');

  // Get the last 10 digits (strip country code if present)
  const last10 = digits.slice(-10);

  if (last10.length !== 10) return phone; // fallback to raw value

  return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
}

/**
 * Truncate text to a maximum length, appending "..." when truncated.
 * @example truncateText("Hello World", 5) → "Hello..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
