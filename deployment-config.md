# Deployment Configuration Guide

## Environment Variables

Set these environment variables in your hosting platform:

```bash
# Required
NODE_ENV=production
PORT=3000  # Usually auto-set by hosting platforms

# Security
SESSION_SECRET=your-very-secure-random-string-here-change-this

# HTTPS (only set to 'true' if your hosting platform uses HTTPS)
HTTPS=true

# Optional: Custom password hash
# Generate using: node change-password.js
# CUSTOM_PASSWORD_HASH=your-bcrypt-hash-here
```

## Platform-Specific Deployment

### Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-bookmark-app-name`
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-secure-secret-key
   heroku config:set HTTPS=true
   ```
5. Deploy: `git push heroku master`

### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard:
   - `NODE_ENV=production`
   - `SESSION_SECRET=your-secure-secret-key`
   - `HTTPS=true`
3. Railway will auto-deploy from your GitHub repo

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add environment variables in Vercel dashboard

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set run command: `node server.js`
3. Add environment variables in the dashboard

## Troubleshooting Network Errors

### 1. Check Server Logs
Look for these messages in your hosting platform's logs:
- "Bookmark Bunker running on port XXX"
- "Server ready to accept connections"
- Any error messages

### 2. Verify Environment Variables
Ensure these are set correctly:
- `NODE_ENV=production`
- `SESSION_SECRET` (should be a long random string)
- `HTTPS=true` (for platforms that use HTTPS)

### 3. Common Issues
- **Session errors**: Make sure `SESSION_SECRET` is set
- **CORS issues**: Server should bind to `0.0.0.0` (now fixed)
- **File permissions**: Ensure the app can create `bookmarks.json`
- **Port issues**: Use `process.env.PORT` (already configured)

### 4. Test Your Deployment
Try these URLs in your browser:
- `https://your-app-name.platform.com/` (should load the login page)
- Check browser developer tools for network errors
- Verify the login request goes to the correct URL 