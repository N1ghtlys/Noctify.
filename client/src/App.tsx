import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause,
  FaStepForward, 
  FaStepBackward,
  FaTimes,
  FaMusic
} from 'react-icons/fa';
import axios from 'axios';
import Login from './components/Login';
import Callback from './components/Callback';
import Lyrics from './components/Lyrics';

// API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

// Display an error message if environment variables are missing
if (!API_URL) {
  console.error('Missing REACT_APP_API_URL environment variable');
}

// Styled components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00BCD4 0%, #191414 100%);
  color: white;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: env(safe-area-inset-top);
  }

  @media (max-width: 768px) and (orientation: landscape) {
    padding: 0.5rem;
    align-items: center;
    min-height: 100vh;
  }
`;

const IOSInstructions = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 1rem;
  text-align: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 188, 212, 0.2);
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Player = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  backdrop-filter: blur(10px);
  position: relative;
  border: 1px solid rgba(0, 188, 212, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.5rem;
    border-radius: 0;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    box-shadow: none;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    flex-direction: row;
    width: 100%;
    min-height: auto;
    padding: 1rem;
    gap: 1rem;
    border-radius: 0.5rem;
  }
`;

const AlbumSection = styled(motion.div)`
  flex-shrink: 0;
  width: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    width: 200px;
    max-width: none;
    margin: 0;
  }
`;

const AlbumArt = styled(motion.img)`
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const InfoSection = styled(motion.div)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
    gap: 1rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    gap: 0.5rem;
    padding: 0;
  }
`;

const TrackInfo = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    text-align: left;
  }
`;

const TrackName = styled(motion.h2)`
  font-size: 1.5rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0 1rem;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    font-size: 1.2rem;
    padding: 0;
  }
`;

const ArtistName = styled(motion.p)`
  font-size: 1rem;
  margin: 0.5rem 0 0;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: #00BCD4;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    font-size: 0.9rem;
    padding: 0;
    margin: 0.25rem 0 0;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    gap: 2rem;
    padding: 0 1rem;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    margin-top: 0.5rem;
    gap: 1rem;
    padding: 0;
  }
`;

const ControlButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 48px;
  height: 48px;

  &:hover {
    color: #00BCD4;
    background: rgba(0, 188, 212, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 2rem;
    background: rgba(0, 188, 212, 0.1);
    border: 1px solid rgba(0, 188, 212, 0.2);
  }

  @media (max-width: 768px) and (orientation: landscape) {
    width: 56px;
    height: 56px;
    font-size: 1.8rem;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 8px;
    margin: 1rem 0;
  }

  @media (max-width: 768px) and (orientation: landscape) {
    height: 6px;
    margin: 0.5rem 0;
  }
`;

const ProgressBarFill = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #00BCD4;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.5);
`;

interface PlaybackState {
  is_playing: boolean;
  item: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
    duration_ms: number;
  } | null;
  progress_ms?: number;
}

interface ProgressBarProps {
  duration: number;
  position: number;
  onSeek: (position: number) => void;
}

function ProgressBar({ duration, position, onSeek }: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressWidth = `${(position / duration) * 100}%`;

  const handleInteraction = (clientX: number) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * duration;
    onSeek(Math.max(0, Math.min(duration, position)));
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleInteraction(event.clientX);
  };

  const handleTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    handleInteraction(event.touches[0].clientX);
  };

  return (
    <ProgressBarContainer
      ref={progressBarRef}
      onClick={handleClick}
      onTouchMove={handleTouch}
    >
      <ProgressBarFill
        className="progress-bar"
        style={{ width: progressWidth }}
        initial={{ width: '0%' }}
        animate={{ width: progressWidth }}
        transition={{ duration: 0.1 }}
      />
    </ProgressBarContainer>
  );
}

function PlayerComponent() {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [loadingErrors, setLoadingErrors] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsAvailable, setLyricsAvailable] = useState<boolean | null>(null);
  const accessToken = localStorage.getItem('accessToken');

  // Check if we're on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = (window.matchMedia('(display-mode: standalone)').matches) || 
                      ((window.navigator as any).standalone) || 
                      document.referrer.includes('android-app://');

  const checkLyricsAvailability = React.useCallback(async () => {
    if (!playbackState?.item) return;
    
    try {
      const response = await axios.get(`${API_URL}/lyrics?track=${encodeURIComponent(playbackState.item.name)}&artist=${encodeURIComponent(playbackState.item.artists[0].name)}`);
      setLyricsAvailable(Boolean(response.data?.lyrics));
    } catch (err) {
      setLyricsAvailable(false);
    }
  }, [playbackState?.item]);

  // Extract track info for dependency array
  const currentTrack = React.useMemo(() => {
    if (!playbackState?.item) return null;
    return {
      name: playbackState.item.name,
      artist: playbackState.item.artists[0].name
    };
  }, [playbackState?.item]);

  useEffect(() => {
    if (currentTrack) {
      checkLyricsAvailability();
    }
  }, [currentTrack, checkLyricsAvailability]);

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }

    const fetchPlaybackState = async () => {
      try {
        const response = await axios.get(`${API_URL}/playback`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          timeout: 5000
        });
        
        // Check if we have a valid response
        if (response.status === 200) {
          // Always set the playback state, even if there's no active track
          setPlaybackState(response.data);
          setLoadingErrors(0);
        } else {
          console.log('Unexpected response:', response);
        }
      } catch (error: any) {
        console.error('Error fetching playback state:', error);
        
        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
          console.log('Request timed out, retrying...');
          return; // The next interval will try again
        }
        
        // Handle 204 No Content (no active playback)
        if (error?.response?.status === 204) {
          setPlaybackState({
            is_playing: false,
            item: null,
            progress_ms: 0
          } as PlaybackState);
          return;
        }
        
        // Handle unauthorized access
        if (error?.response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return;
        }
        
        setLoadingErrors(prev => prev + 1);
        
        // If we get 3 consecutive errors, redirect to login
        if (loadingErrors >= 2) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      }
    };

    fetchPlaybackState();
    const interval = setInterval(fetchPlaybackState, 2000);

    return () => clearInterval(interval);
  }, [accessToken, loadingErrors]);

  // Show loading state while we fetch initial data
  if (!playbackState) {
    return (
      <Container>
        <Player
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Connecting to Spotify...</h2>
            <p style={{ opacity: 0.7 }}>Make sure you have an active Spotify player</p>
          </div>
        </Player>
      </Container>
    );
  }

  // Only show "No track playing" if we're sure there's no track
  if (!playbackState.item) {
    return (
      <Container>
        <Player
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <InfoSection>
            <TrackInfo>
              <TrackName>No track playing</TrackName>
              <ArtistName>Open Spotify and start playing music</ArtistName>
            </TrackInfo>
          </InfoSection>
        </Player>
      </Container>
    );
  }

  const handlePlaybackAction = async (action: string) => {
    if (!accessToken) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }
    
    try {
      // Store current state before making changes
      const previousState = playbackState;
      
      // Update local state immediately for better UX
      setPlaybackState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          is_playing: action === 'pause' ? false : true
        };
      });

      // Perform the action
      await axios.post(`${API_URL}/playback/${action}`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 5000
      });
      
      // Refresh the state after a short delay
      setTimeout(async () => {
        try {
          const response = await axios.get(`${API_URL}/playback`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            timeout: 5000
          });
          
          if (response.data && response.data.item) {
            setPlaybackState(response.data);
          } else if (previousState) {
            // If we don't get valid data, revert to the previous state
            setPlaybackState(previousState);
          }
        } catch (error: any) {
          if (error.code === 'ECONNABORTED') {
            console.log('Request timed out, keeping previous state');
            if (previousState) {
              setPlaybackState(previousState);
            }
            return;
          }

          // If there's an auth error, redirect to login
          if (error?.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return;
          }
          // If there's an error, revert to the previous state
          if (previousState) {
            setPlaybackState(previousState);
          }
        }
      }, 300);
    } catch (error: any) {
      console.error('Playback action failed:', error.code);
      // If there's an auth error, redirect to login
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
      // Revert to the previous state on error
      if (playbackState) {
        setPlaybackState(playbackState);
      }
    }
  };

  const handleNext = async () => {
    if (!accessToken) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }
    
    try {
      // Store current state before making changes
      const previousState = playbackState;
      
      // Perform the action
      await axios.post(`${API_URL}/playback/next`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 5000
      });
      
      // Refresh the state after a short delay
      setTimeout(async () => {
        try {
          const response = await axios.get(`${API_URL}/playback`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            timeout: 5000
          });
          
          if (response.data && response.data.item) {
            setPlaybackState(response.data);
          } else if (previousState) {
            // If we don't get valid data, revert to the previous state
            setPlaybackState(previousState);
          }
        } catch (error: any) {
          // If there's an auth error, redirect to login
          if (error?.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return;
          }
          // If there's an error, revert to the previous state
          if (previousState) {
            setPlaybackState(previousState);
          }
        }
      }, 300);
    } catch (error: any) {
      console.error('Next track action failed');
      // If there's an auth error, redirect to login
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
      // Revert to the previous state on error
      if (playbackState) {
        setPlaybackState(playbackState);
      }
    }
  };

  const handlePrevious = async () => {
    if (!accessToken) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }
    
    try {
      // Store current state before making changes
      const previousState = playbackState;
      
      // Perform the action
      await axios.post(`${API_URL}/playback/previous`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 5000
      });
      
      // Refresh the state after a short delay
      setTimeout(async () => {
        try {
          const response = await axios.get(`${API_URL}/playback`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            timeout: 5000
          });
          
          if (response.data && response.data.item) {
            setPlaybackState(response.data);
          } else if (previousState) {
            // If we don't get valid data, revert to the previous state
            setPlaybackState(previousState);
          }
        } catch (error: any) {
          // If there's an auth error, redirect to login
          if (error?.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return;
          }
          // If there's an error, revert to the previous state
          if (previousState) {
            setPlaybackState(previousState);
          }
        }
      }, 300);
    } catch (error: any) {
      console.error('Previous track action failed');
      // If there's an auth error, redirect to login
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
      // Revert to the previous state on error
      if (playbackState) {
        setPlaybackState(playbackState);
      }
    }
  };

  const handleSeek = async (position: number) => {
    try {
      await axios.put(`${API_URL}/seek`, { position }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 5000
      });
    } catch (error) {
      console.error('Seek action failed');
    }
  };

  return (
    <Container>
      {isIOS && !isStandalone && (
        <IOSInstructions>
          For the best experience, please open in Safari and add to your home screen
        </IOSInstructions>
      )}
      <Player
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AlbumSection>
          <AnimatePresence mode="wait">
            <AlbumArt
              key={playbackState.item?.album.images[0].url}
              src={playbackState.item?.album.images[0].url}
              alt="Album Art"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            />
          </AnimatePresence>
        </AlbumSection>

        <InfoSection>
          <TrackInfo>
            <AnimatePresence mode="wait">
              <TrackName
                key={`track-${playbackState.item?.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {playbackState.item?.name}
              </TrackName>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <ArtistName
                key={`artist-${playbackState.item?.artists.map(a => a.name).join()}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.1,
                  ease: "easeOut"
                }}
              >
                {playbackState.item?.artists.map(artist => artist.name).join(', ')}
              </ArtistName>
            </AnimatePresence>
          </TrackInfo>

          <ProgressBar
            duration={playbackState?.item?.duration_ms || 0}
            position={playbackState?.progress_ms || 0}
            onSeek={handleSeek}
          />

          <Controls>
            <ControlButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePrevious()}
            >
              <FaStepBackward />
            </ControlButton>
            <ControlButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePlaybackAction(playbackState.is_playing ? 'pause' : 'play')}
            >
              {playbackState.is_playing ? <FaPause /> : <FaPlay />}
            </ControlButton>
            <ControlButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNext()}
            >
              <FaStepForward />
            </ControlButton>
            {lyricsAvailable && (
              <ControlButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowLyrics(!showLyrics)}
              >
                {showLyrics ? <FaTimes /> : <FaMusic />}
              </ControlButton>
            )}
          </Controls>
        </InfoSection>
      </Player>

      {playbackState.item && lyricsAvailable && (
        <Lyrics
          key={`${playbackState.item.name}-${playbackState.item.artists[0].name}`}
          trackName={playbackState.item.name}
          artistName={playbackState.item.artists[0].name}
          isVisible={showLyrics}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/"
          element={
            localStorage.getItem('accessToken') ? (
              <PlayerComponent />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
