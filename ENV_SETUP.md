# Environment Variables Setup

To securely share this project without exposing sensitive API keys, follow these steps:

## Environment Variables

Create the following environment variable files (DO NOT COMMIT THESE FILES):

### 1. Root directory `.env` file
Create a file named `.env` in the root directory with these variables:

```
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=https://your-domain.com/callback

# Server Configuration
PORT=3001
```

### 2. Client directory `.env` file
Create a file named `.env.local` in the `client` directory with these variables:

```
# API URL & Spotify settings
REACT_APP_API_URL=https://your-domain.com/.netlify/functions/server
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
REACT_APP_REDIRECT_URI=https://your-domain.com/callback
```

### 3. Netlify Functions `.env` file (for Netlify deployment)
If deploying to Netlify, configure these environment variables in your Netlify settings:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`

## ⚠️ Security Warning ⚠️

NEVER commit your .env files to Git or include them in shared code repositories! These files contain sensitive credentials and should always remain private.

1. Both `.env` and `.env.local` files are already added to `.gitignore` to prevent accidental commits
2. Double-check before committing that you haven't exposed any sensitive information
3. Always use environment variables for:
   - API keys
   - Client IDs/secrets
   - Redirect URLs
   - Any other sensitive configuration

## Local Development

For local development, you'll need to create these .env files with your own Spotify API credentials.

1. Get your Spotify API credentials from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Set the correct redirect URI in your Spotify app settings

## Deployment

When deploying:

1. Configure environment variables in your hosting platform (Netlify, Vercel, etc.)
2. Never commit .env files to your repository
3. Use different redirect URIs for development and production environments

This setup ensures that sensitive data is kept secure while allowing the project to be shared and collaborated on safely. 