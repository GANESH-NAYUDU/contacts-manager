// pages/api/contacts/upload.js
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import db from '../../../lib/database';
import moment from 'moment';
import authenticate from '../../../middlewares/auth';

const upload = multer({ dest: 'uploads/' });

export default authenticate(async (req, res) => {
  const contacts = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (row) => {
      contacts.push(row);
    })
    .on('end', () => {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const stmt = db.prepare(
        'INSERT INTO contacts (name, email, phone, address, timezone, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );

      contacts.forEach(contact => {
        stmt.run(contact.name, contact.email, contact.phone, contact.address, contact.timezone, req.user.id, now, now);
      });

      stmt.finalize((err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to upload contacts', err });
        }
        res.status(200).json({ message: 'Contacts uploaded successfully' });
      });
    });
});

export const config = {
  api: {
    bodyParser: false,
  },
};
