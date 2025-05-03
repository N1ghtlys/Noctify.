# 🎧 Noctify

<div align="center">
  
  ![Noctify Logo](https://img.shields.io/badge/🎵-Noctify-00BCD4?style=for-the-badge)
  
  [![N1ghtm License](https://img.shields.io/badge/License-N1ghtm-blue.svg)](https://github.com/dn1ghtm/noctify)
  [![React](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react)](https://reactjs.org/)
  [![Spotify](https://img.shields.io/badge/Spotify-API-1DB954?logo=spotify&logoColor=white)](https://developer.spotify.com/documentation/web-api/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  <br>
  <strong>A simple, elegant open-source Spotify controller for your desktop.</strong>
</div>

<br>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">🎮 <b>Playback Controls</b></td>
      <td align="center">🎵 <b>Real-time Updates</b></td>
      <td align="center">📱 <b>Responsive Design</b></td>
    </tr>
    <tr>
      <td align="center">🔍 <b>Lyrics Integration</b></td>
      <td align="center">🌓 <b>Beautiful UI</b></td>
      <td align="center">🔒 <b>Secure Authentication</b></td>
    </tr>
  </table>
</div>

Noctify is a minimalist Spotify controller designed to provide a beautiful, distraction-free interface for controlling your music while you work. It's completely open-source and free to use, focusing on simplicity and elegance.

## 🚀 Live Demo

*https://noctify.n1ghtly.hu*

## 🛠️ Tech Stack

- **Frontend**: React, Emotion (CSS-in-JS), Framer Motion
- **Backend**: Node.js, Express
- **API**: Spotify Web API
- **Deployment**: Netlify/Vercel

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/dn1ghtm/noctify.git
   cd noctify
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:
   ```
   # Spotify API Credentials
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   
   # Server Configuration
   PORT=3001
   ```

   Create a `.env.local` file in the `client` directory:
   ```
   # API URL & Spotify settings
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   REACT_APP_REDIRECT_URI=http://localhost:3000/callback
   ```

4. **Start the application**
   ```bash
   # On Windows, you can use the included batch file
   start-noctify.bat
   
   # Or start manually:
   # Terminal 1 - Start the server
   npm start
   
   # Terminal 2 - Start the client
   cd client
   npm start
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Security

This project is configured to use environment variables for all sensitive information:

- ⚠️ **NEVER commit .env files** to your repository
- ✅ Always use environment variables for API keys and secrets
- 📝 See [ENV_SETUP.md](ENV_SETUP.md) for detailed security guidelines

## 🌟 How It Works

1. **Connect your Spotify account** - Securely authenticate with Spotify
2. **Control playback** - Play, pause, skip, and control volume
3. **View track info** - See beautiful album art and track details
4. **Display lyrics** - Get synchronized lyrics for your current track

## 🧑‍💻 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve Noctify.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

Please make sure to update tests as appropriate and follow the code style.

## 📄 License

Copyright © N1ghtm 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following condition:

**Attribution Requirement:**
Any public or distributed use of the Software, or any substantial portion thereof, must include visible credit to the original author, N1ghtm. Attribution must be clearly displayed in a prominent and reasonable location such as:
- Within any user interface (e.g. an "About" section, splash screen, footer, or credits page)
- Or within documentation or accompanying materials (e.g. README file or project website)

This license does not impose restrictions on usage, modification, or distribution beyond the requirement for attribution.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing the music API
- [lyrics.ovh](https://lyricsovh.docs.apiary.io/) for the lyrics API
- All the amazing open-source libraries used in this project

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/dn1ghtm">N1ghtm</a>
</div> 
