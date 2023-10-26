const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 


const db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

const login = async (req, res) => {
  const { username, password } = req.body;


  const query = 'SELECT * FROM Benutzer WHERE Benutzername = ?';
  db.get(query, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!row) {
      // Benutzer nicht gefunden, 401 Unauthorized zurückgeben
      return res.status(401).json({ error: 'Unauthorized' });
    }

    bcrypt.compare(password, row.Passwort, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error(bcryptErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result) {
   
        const tokenData = {
          username: row.Benutzername,
        };


        const token = jwt.sign(tokenData, 'IhrGeheimesToken', { expiresIn: '1h' });

   
        return res.status(200).json({ token });
      } else {

        return res.status(401).json({ error: 'Unauthorized' });
      }
    });
  });
};

module.exports = { login };
