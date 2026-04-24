const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Dummy user database
const users = [
    { username: "admin", password: "1234" },
    { username: "user", password: "abcd" }
];

// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if(user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});