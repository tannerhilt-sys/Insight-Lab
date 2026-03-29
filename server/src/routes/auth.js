import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, addUser, getUser } from '../data/store.js';
import { authenticate, signToken } from '../middleware/auth.js';

const router = Router();

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, buddyName, ageConfirmed } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!ageConfirmed) {
      return res.status(400).json({ error: 'You must confirm you are old enough to use this app' });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      buddyName: buddyName || 'Buddy',
      ageConfirmed: !!ageConfirmed,
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

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, buddyName: user.buddyName } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /me (authenticated)
router.get('/me', authenticate, (req, res) => {
  try {
    const user = getUser(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
