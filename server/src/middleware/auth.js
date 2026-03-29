import jwt from 'jsonwebtoken';
import { getUser } from '../data/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/**
 * Express middleware that validates the Bearer JWT and attaches the user to req.user.
 * Tokens are signed with JWT_SECRET and expire in 7 days (see signToken).
 * Sets req.user = { id, email, buddyName } on success.
 * Returns 401 if the header is missing, the token is invalid, or the user no longer exists.
 */
export function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = getUser(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: user.id, email: user.email, buddyName: user.buddyName };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Sign a JWT for the given userId. Expires in 7 days.
 * @param {string} userId
 * @returns {string} Signed JWT
 */
export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
