// pages/api/contacts/create.js
import authenticate from '../../../middlewares/auth';
import db from '../../../lib/database';
import moment from 'moment';

export default authenticate(async (req, res) => {
  const { name, email, phone, address, timezone } = req.body;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  db.run(
    `INSERT INTO contacts (name, email, phone, address, timezone, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, address, timezone, req.user.id, now, now],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create contact', err });
      }
      res.status(201).json({ message: 'Contact created successfully' });
    }
  );
});
