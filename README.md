# ReuseMart Backend

This project now includes a simple Node.js backend server to support user signup/login and catalog data.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
3. Open the site in your browser:
   ```text
   http://localhost:3000/login.html
   ```

## What is included

- `server.js` — Express server and REST API endpoints
- `data/users.json` — stores registered users
- `data/listings.json` — stores sell listings
- `data/rentals.json` — stores rental listings

## Notes

- This backend uses file-based storage and is meant for development/demo use.
- Passwords are stored in plain text in `data/users.json`; for production, use a proper database and password hashing.
