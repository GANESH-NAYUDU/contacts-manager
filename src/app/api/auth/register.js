// pages/api/auth/register.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../../lib/database';
import moment from 'moment';

export default async function POST(req, res) {
  const { name, email, password } = req.body;

  db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
    if (row) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    db.run(
      `INSERT INTO users (name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, now, now],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to register user' });
        }

        const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
      }
    );
  });
}
