// pages/api/contacts/list.js
import authenticate from '../../../middlewares/auth';
import db from '../../../lib/database';

export default authenticate((req, res) => {
  const { name, email, timezone } = req.query;
  const filters = [];
  const params = [];

  if (name) {
    filters.push('name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    filters.push('email LIKE ?');
    params.push(`%${email}%`);
  }
  if (timezone) {
    filters.push('timezone = ?');
    params.push(timezone);
  }

  let query = 'SELECT * FROM contacts WHERE userId = ? AND isDeleted = 0';
  if (filters.length) {
    query += ` AND ${filters.join(' AND ')}`;
  }

  db.all(query, [req.user.id, ...params], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve contacts', err });
    }
    res.status(200).json(rows);
  });
});
