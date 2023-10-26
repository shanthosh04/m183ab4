const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database('sql.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

const getCustomersInUSA = (req, res) => {
  const sql = `SELECT username username,
                      password password,
                      FROM sql`;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(rows);
  });
};

const login = async (req, res) => {
};

module.exports = { getCustomersInUSA, login };
