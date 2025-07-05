# 📚 Bookmark Bunker

A simple, password-protected personal bookmark manager for your articles and links.

## Features

- **Password Protection** - Simple login system to keep your bookmarks private
- **Add/Edit/Delete Bookmarks** - Full CRUD operations for your bookmarks
- **Tagging System** - Organize bookmarks with tags
- **Search & Filter** - Find bookmarks by title, URL, or tags
- **Date Tracking** - Automatically tracks when bookmarks were added
- **Responsive Design** - Works on desktop and mobile devices
- **JSON Storage** - Simple file-based storage, easy to backup

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access your bookmark manager:**
   Open your browser and go to `http://localhost:3000`

4. **Login:**
   - Default password: `password`
   - **IMPORTANT:** Change the password immediately (see Security section)

## Usage

### Adding Bookmarks
1. Enter the URL and title of the bookmark
2. Optionally add tags (comma-separated)
3. Click "Add Bookmark"

### Managing Bookmarks
- **Edit:** Click the "Edit" button on any bookmark
- **Delete:** Click the "Delete" button (requires confirmation)
- **Search:** Use the search box to find bookmarks by title, URL, or tags
- **Filter:** Use the tag dropdown to filter by specific tags

### Tags
- Add multiple tags separated by commas
- Tags help organize and find your bookmarks
- Use consistent naming (e.g., "tech", "article", "ai", "programming")

## Security

### Changing the Password

**Method 1: Generate a new password hash**
```bash
node -e "console.log(require('bcrypt').hashSync('YOUR_NEW_PASSWORD', 10))"
```

**Method 2: Use the provided script**
```bash
node change-password.js
```

Then update the `PASSWORD_HASH` constant in `server.js` with the new hash.

### Additional Security
- Change the session secret in `server.js` (line 11)
- Use HTTPS in production
- Consider adding rate limiting for the login endpoint

## File Structure

```
bookmark-bunker/
├── server.js          # Main server file
├── package.json       # Dependencies
├── bookmarks.json     # Your bookmarks (auto-created)
├── public/
│   ├── index.html     # Main HTML file
│   ├── style.css      # Styles
│   └── script.js      # Client-side JavaScript
└── README.md          # This file
```

## Data Backup

Your bookmarks are stored in `bookmarks.json`. To backup:
```bash
cp bookmarks.json bookmarks-backup-$(date +%Y%m%d).json
```

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Adding Features
- Server-side code: Edit `server.js`
- Client-side code: Edit files in `public/`
- Styles: Edit `public/style.css`

## Deployment

### Local Network Access
To access from other devices on your network:
1. Find your local IP address
2. Start the server: `HOST=0.0.0.0 npm start`
3. Access via `http://YOUR_IP:3000`

### Cloud Deployment
This can be deployed to any Node.js hosting service:
- Railway
- Heroku
- Vercel
- DigitalOcean
- AWS
- Google Cloud

## Troubleshooting

### Common Issues

1. **Cannot access from other devices**
   - Make sure firewall allows port 3000
   - Use `HOST=0.0.0.0 npm start`

2. **Bookmarks not saving**
   - Check file permissions in the directory
   - Ensure the app has write access

3. **Login not working**
   - Verify the password hash is correct
   - Check browser console for errors

4. **Port already in use**
   - Change the port: `PORT=3001 npm start`

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - Feel free to use and modify for your personal use.

---

**Default Login:** `password` (change this immediately!) 