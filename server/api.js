const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importieren des jsonwebtoken-Pakets

// Öffnen der Datenbankverbindung
const db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

const login = async (req, res) => {
  const { username, password } = req.body;

  // Abfrage des Benutzers aus der Datenbank anhand des Benutzernamens
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
        // Authentifizierung erfolgreich
        const tokenData = {
          username: row.Benutzername,
        };

        // Token generieren (mit Ablaufzeit von 1 Stunde)
        const token = jwt.sign(tokenData, 'IhrGeheimesToken', { expiresIn: '1h' });

        // Token an den Client zurückgeben
        return res.status(200).json({ token });
      } else {
        // Passwörter stimmen nicht überein, 401 Unauthorized zurückgeben
        return res.status(401).json({ error: 'Unauthorized' });
      }
    });
  });
};

module.exports = { login }; // Hier ändert sich der Export auf die `login`-Funktion
