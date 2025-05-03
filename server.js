require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Get access token
app.post('/api/login', async (req, res) => {
  const { code } = req.body;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to get access token' });
  }
});

// Refresh token
app.post('/api/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  spotifyApi.setRefreshToken(refreshToken);
  try {
    const data = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

// Get current playback
app.get('/api/playback', async (req, res) => {
  const { accessToken } = req.query;
  spotifyApi.setAccessToken(accessToken);
  
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    
    // Make sure we have actual playback data before sending it
    if (data && data.body && data.body.item) {
      res.json(data.body);
    } else {
      res.status(204).json(null);
    }
  } catch (err) {
    console.error('Failed to get playback state:', err);
    res.status(500).json({ error: 'Failed to get playback state' });
  }
});

// Control playback
app.post('/api/playback/:action', async (req, res) => {
  const { accessToken } = req.body;
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
    res.status(400).json({ error: 'Failed to control playback' });
  }
});

// Add seek endpoint
app.put('/api/playback/seek', async (req, res) => {
  const { accessToken, position_ms } = req.body;
  spotifyApi.setAccessToken(accessToken);
  
  try {
    await spotifyApi.seek(position_ms);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to seek:', err);
    res.status(400).json({ error: 'Failed to seek' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 