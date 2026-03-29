import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, addUser, getUser } from '../data/store.js';
import { authenticate, signToken } from '../middleware/auth.js';
import { MAX_BUDDY_NAME_LENGTH } from '../constants.js';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function validateSignupInput(email, password, buddyName) {
  if (!email || !password) {
    return 'Email and password are required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please provide a valid email address';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return 'Password is too long';
  }
  if (buddyName && buddyName.trim().length > MAX_BUDDY_NAME_LENGTH) {
    return `Buddy name must be ${MAX_BUDDY_NAME_LENGTH} characters or fewer`;
  }
  return null;
}

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, buddyName, ageConfirmed } = req.body;

    const validationError = validateSignupInput(email, password, buddyName);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (!ageConfirmed) {
      return res.status(400).json({ error: 'You must confirm you are 16 or older to use this app' });
    }

    const existing = getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      buddyName: buddyName ? buddyName.trim() : 'Buddy',
      ageConfirmed: true,
      createdAt: new Date().toISOString(),
    };

    addUser(user);

    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email, buddyName: user.buddyName } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const user = getUserByEmail(email.toLowerCase().trim());

    // Always run bcrypt.compare to prevent timing attacks that reveal whether an email exists
    const dummyHash = '$2a$10$invalidhashpaddingtomatchlength00000000000000000000000';
    const valid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash).then(() => false);

    if (!user || !valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, buddyName: user.buddyName } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /me
router.get('/me', authenticate, (req, res) => {
  try {
    const user = getUser(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password: _password, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
