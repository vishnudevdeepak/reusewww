const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json');
const RENTALS_FILE = path.join(DATA_DIR, 'rentals.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function ensureDataFile(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

function readJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Could not read ${filePath}:`, err.message);
    return [];
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

ensureDataFile(USERS_FILE, [
  { username: 'admin', password: '1234' },
]);
ensureDataFile(LISTINGS_FILE, []);
ensureDataFile(RENTALS_FILE, []);

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const users = readJson(USERS_FILE);
  const exists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(409).json({ success: false, message: 'Username already exists.' });
  }

  users.push({ username, password });
  writeJson(USERS_FILE, users);
  res.json({ success: true, message: 'Account created successfully.' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const users = readJson(USERS_FILE);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  res.json({ success: true, username: user.username });
});

app.get('/api/listings', (req, res) => {
  const type = req.query.type;
  let listings = readJson(LISTINGS_FILE);

  if (type) {
    listings = listings.filter(item => item.type === type);
  }

  res.json(listings);
});

app.post('/api/listings', (req, res) => {
  const listing = req.body;
  if (!listing || !listing.name) {
    return res.status(400).json({ success: false, message: 'Listing data is required.' });
  }

  const listings = readJson(LISTINGS_FILE);
  const newItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...listing,
  };

  listings.push(newItem);
  writeJson(LISTINGS_FILE, listings);
  res.json({ success: true, item: newItem });
});

app.get('/api/rentals', (req, res) => {
  const rentals = readJson(RENTALS_FILE);
  res.json(rentals);
});

app.post('/api/rentals', (req, res) => {
  const rental = req.body;
  if (!rental || !rental.name) {
    return res.status(400).json({ success: false, message: 'Rental data is required.' });
  }

  const rentals = readJson(RENTALS_FILE);
  const newItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...rental,
  };

  rentals.push(newItem);
  writeJson(RENTALS_FILE, rentals);
  res.json({ success: true, item: newItem });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
