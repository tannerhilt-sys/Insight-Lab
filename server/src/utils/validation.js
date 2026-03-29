/**
 * Shared input validation utilities used across portfolio, budget, and auth routes.
 * Each function returns null on success or a human-readable error string on failure.
 * Routes call these and return res.status(400).json({ error }) on non-null results.
 */
import { MIN_AMOUNT, MAX_AMOUNT, MAX_SHARES } from '../constants.js';

const TICKER_REGEX = /^[A-Z]{1,10}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_REGEX = /^\d{4}-\d{2}$/;

/**
 * Validate a stock ticker symbol (1-10 uppercase letters, e.g. "AAPL", "BRK.A"-style not supported).
 * @param {unknown} ticker
 * @returns {string|null} error message or null
 */
export function validateTicker(ticker) {
  if (!ticker || typeof ticker !== 'string') return 'ticker is required';
  if (!TICKER_REGEX.test(ticker.toUpperCase().trim())) return 'ticker must be 1-10 uppercase letters';
  return null;
}

/**
 * Validate a whole-number share quantity in range (0, MAX_SHARES].
 * @param {unknown} shares
 * @returns {string|null}
 */
export function validateShares(shares) {
  const num = Number(shares);
  if (!isFinite(num) || isNaN(num)) return 'shares must be a valid number';
  if (num <= 0) return 'shares must be greater than 0';
  if (num > MAX_SHARES) return `shares must not exceed ${MAX_SHARES.toLocaleString()}`;
  if (!Number.isInteger(num)) return 'shares must be a whole number';
  return null;
}

/**
 * Validate a per-share price in range [MIN_AMOUNT, MAX_AMOUNT].
 * @param {unknown} price
 * @returns {string|null}
 */
export function validatePrice(price) {
  const num = Number(price);
  if (!isFinite(num) || isNaN(num)) return 'price must be a valid number';
  if (num < MIN_AMOUNT) return `price must be at least ${MIN_AMOUNT}`;
  if (num > MAX_AMOUNT) return `price must not exceed ${MAX_AMOUNT.toLocaleString()}`;
  return null;
}

/**
 * Validate a monetary amount in range [MIN_AMOUNT, MAX_AMOUNT].
 * Used for budget entries and savings goal targets.
 * @param {unknown} amount
 * @returns {string|null}
 */
export function validateAmount(amount) {
  const num = Number(amount);
  if (!isFinite(num) || isNaN(num)) return 'amount must be a valid number';
  if (num < MIN_AMOUNT) return `amount must be at least ${MIN_AMOUNT}`;
  if (num > MAX_AMOUNT) return `amount must not exceed ${MAX_AMOUNT.toLocaleString()}`;
  return null;
}

/**
 * Validate an optional ISO date string (YYYY-MM-DD). Passes if date is falsy.
 * @param {unknown} date
 * @returns {string|null}
 */
export function validateDate(date) {
  if (date && !DATE_REGEX.test(date)) return 'date must be in YYYY-MM-DD format';
  return null;
}

/**
 * Validate an optional month filter string (YYYY-MM). Passes if month is falsy.
 * @param {unknown} month
 * @returns {string|null}
 */
export function validateMonth(month) {
  if (month && !MONTH_REGEX.test(month)) return 'month must be in YYYY-MM format';
  return null;
}
