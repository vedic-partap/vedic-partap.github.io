const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const PASSWORD_HASH = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password" - change this!
const BOOKMARKS_FILE = 'bookmarks.json';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key-change-this', // Change this!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Helper functions
function loadBookmarks() {
    try {
        if (fs.existsSync(BOOKMARKS_FILE)) {
            return JSON.parse(fs.readFileSync(BOOKMARKS_FILE, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        return [];
    }
}

function saveBookmarks(bookmarks) {
    try {
        fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving bookmarks:', error);
        return false;
    }
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { password } = req.body;
    
    try {
        const isValid = await bcrypt.compare(password, PASSWORD_HASH);
        if (isValid) {
            req.session.authenticated = true;
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Bookmark API endpoints
app.get('/api/bookmarks', requireAuth, (req, res) => {
    const bookmarks = loadBookmarks();
    res.json(bookmarks);
});

app.post('/api/bookmarks', requireAuth, (req, res) => {
    const { url, title, tags } = req.body;
    
    if (!url || !title) {
        return res.status(400).json({ error: 'URL and title are required' });
    }
    
    const bookmarks = loadBookmarks();
    const newBookmark = {
        id: Date.now().toString(),
        url,
        title,
        tags: tags || [],
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString()
    };
    
    bookmarks.unshift(newBookmark);
    
    if (saveBookmarks(bookmarks)) {
        res.json(newBookmark);
    } else {
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
});

app.put('/api/bookmarks/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { url, title, tags } = req.body;
    
    const bookmarks = loadBookmarks();
    const index = bookmarks.findIndex(b => b.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    bookmarks[index] = {
        ...bookmarks[index],
        url: url || bookmarks[index].url,
        title: title || bookmarks[index].title,
        tags: tags || bookmarks[index].tags,
        dateModified: new Date().toISOString()
    };
    
    if (saveBookmarks(bookmarks)) {
        res.json(bookmarks[index]);
    } else {
        res.status(500).json({ error: 'Failed to update bookmark' });
    }
});

app.delete('/api/bookmarks/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    const bookmarks = loadBookmarks();
    const index = bookmarks.findIndex(b => b.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    bookmarks.splice(index, 1);
    
    if (saveBookmarks(bookmarks)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Bookmark Bunker running on port ${PORT}`);
    console.log('Default password: "password" - Please change this!');
}); 