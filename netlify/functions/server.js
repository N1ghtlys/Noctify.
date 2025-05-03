const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Check for required environment variables
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Get environment variables from Netlify
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Login endpoint
app.post('/.netlify/functions/server', async (req, res) => {
  const { code, redirectUri } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Update redirect URI if provided in the request
    if (redirectUri) {
      spotifyApi.setRedirectURI(redirectUri);
    }
    
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ 
      error: 'Failed to login',
      details: err.message
    });
  }
});

// Refresh token endpoint
app.post('/.netlify/functions/server/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  spotifyApi.setRefreshToken(refreshToken);
  try {
    const data = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in
    });
  } catch (err) {
    console.error('Token refresh error:', err.message);
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

// Playback state endpoint
app.get('/.netlify/functions/server/playback', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization header is required' });
  }
  const accessToken = authHeader.split(' ')[1];
  spotifyApi.setAccessToken(accessToken);
  
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    
    // Log the response for debugging
    console.log('Spotify API Response:', JSON.stringify(data.body, null, 2));
    
    // If no data or no active device, return appropriate response
    if (!data.body) {
      console.log('No playback data received');
      return res.status(204).send();
    }

    // Check if there's an active device but no track playing
    if (data.body.device && !data.body.item) {
      return res.json({
        is_playing: false,
        progress_ms: 0,
        item: null,
        device: data.body.device
      });
    }
    
    // Return the full playback state
    res.json(data.body);
  } catch (err) {
    console.error('Playback state error:', err);
    
    // Handle specific error cases
    if (err.statusCode === 401) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (err.statusCode === 204 || err.statusCode === 404) {
      return res.status(204).send();
    }
    
    res.status(400).json({ error: 'Failed to get playback state' });
  }
});

// Playback control endpoints
app.post('/.netlify/functions/server/playback/:action', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization header is required' });
  }
  const accessToken = authHeader.split(' ')[1];
  const { action } = req.params;
  spotifyApi.setAccessToken(accessToken);
  try {
    switch (action) {
      case 'play':
        await spotifyApi.play();
        break;
      case 'pause':
        await spotifyApi.pause();
        break;
      case 'next':
        await spotifyApi.skipToNext();
        break;
      case 'previous':
        await spotifyApi.skipToPrevious();
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Playback control error:', err.message);
    res.status(400).json({ error: `Failed to ${action}` });
  }
});

// Seek endpoint
app.put('/.netlify/functions/server/seek', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization header is required' });
  }
  const accessToken = authHeader.split(' ')[1];
  const { position } = req.body;
  if (position === undefined) {
    return res.status(400).json({ error: 'Position is required' });
  }
  spotifyApi.setAccessToken(accessToken);
  try {
    await spotifyApi.seek(position);
    res.json({ success: true });
  } catch (err) {
    console.error('Seek error:', err.message);
    res.status(400).json({ error: 'Failed to seek' });
  }
});

// Update the lyrics endpoint
app.get('/.netlify/functions/server/lyrics', async (req, res) => {
  try {
    const { track, artist } = req.query;
    
    if (!track || !artist) {
      return res.status(400).json({ error: 'Missing track or artist parameter' });
    }

    // Format the artist and track names for the API
    const formattedArtist = encodeURIComponent(artist);
    const formattedTrack = encodeURIComponent(track);

    const response = await axios.get(`https://api.lyrics.ovh/v1/${formattedArtist}/${formattedTrack}`);

    if (response.data && response.data.lyrics) {
      return res.json({
        lyrics: response.data.lyrics
      });
    }

    return res.status(404).json({ error: 'Lyrics not found' });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

// Lyrics endpoint
app.get('/api/lyrics', async (req, res) => {
  const { track, artist } = req.query;

  if (!track || !artist) {
    return res.status(400).json({ error: 'Missing track or artist parameter' });
  }

  try {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`);
    
    if (response.data && response.data.lyrics) {
      res.json({ lyrics: response.data.lyrics });
    } else {
      res.status(404).json({ error: 'No lyrics found' });
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

module.exports.handler = serverless(app); 