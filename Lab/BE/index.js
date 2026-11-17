const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Sesuaikan jika port Live Server kamu beda
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: 'Kunci',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60
    }
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'davin' && password === '12345') {
        req.session.user = { username };
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error occurred while logging out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

app.get('/status', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
