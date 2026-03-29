import { MIN_AMOUNT, MAX_AMOUNT, MAX_SHARES } from '../constants.js';

const TICKER_REGEX = /^[A-Z]{1,5}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_REGEX = /^\d{4}-\d{2}$/;

export function validateTicker(ticker) {
  if (!ticker || typeof ticker !== 'string') return 'ticker is required';
  if (!TICKER_REGEX.test(ticker.toUpperCase().trim())) return 'ticker must be 1-5 uppercase letters';
  return null;
}

export function validateShares(shares) {
  const num = Number(shares);
  if (!isFinite(num) || isNaN(num)) return 'shares must be a valid number';
  if (num <= 0) return 'shares must be greater than 0';
  if (num > MAX_SHARES) return `shares must not exceed ${MAX_SHARES.toLocaleString()}`;
  if (!Number.isInteger(num)) return 'shares must be a whole number';
  return null;
}

export function validatePrice(price) {
  const num = Number(price);
  if (!isFinite(num) || isNaN(num)) return 'price must be a valid number';
  if (num < MIN_AMOUNT) return `price must be at least ${MIN_AMOUNT}`;
  if (num > MAX_AMOUNT) return `price must not exceed ${MAX_AMOUNT.toLocaleString()}`;
  return null;
}

export function validateAmount(amount) {
  const num = Number(amount);
  if (!isFinite(num) || isNaN(num)) return 'amount must be a valid number';
  if (num < MIN_AMOUNT) return `amount must be at least ${MIN_AMOUNT}`;
  if (num > MAX_AMOUNT) return `amount must not exceed ${MAX_AMOUNT.toLocaleString()}`;
  return null;
}

export function validateDate(date) {
  if (date && !DATE_REGEX.test(date)) return 'date must be in YYYY-MM-DD format';
  return null;
}

export function validateMonth(month) {
  if (month && !MONTH_REGEX.test(month)) return 'month must be in YYYY-MM format';
  return null;
}
