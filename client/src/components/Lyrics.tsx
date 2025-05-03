import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

// API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

// Display an error message if environment variables are missing
if (!API_URL) {
  console.error('Missing REACT_APP_API_URL environment variable');
}

interface LyricsProps {
  trackName: string;
  artistName: string;
  isVisible: boolean;
  onClose: () => void;
}

const LyricsContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 1rem;
  transform: translateY(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  max-height: 50vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 188, 212, 0.2);

  @media (max-width: 768px) {
    max-height: 60vh;
    padding-bottom: env(safe-area-inset-bottom);
  }

  @media (max-width: 768px) and (orientation: landscape) {
    max-height: 80vh;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 188, 212, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 188, 212, 0.5);
  }
`;

const LyricsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 188, 212, 0.2);
`;

const LyricsTitle = styled.h3`
  margin: 0;
  color: #00BCD4;
  font-size: 1.2rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;

  &:hover {
    color: #00BCD4;
    background: rgba(0, 188, 212, 0.1);
  }
`;

const LyricsContent = styled.div`
  white-space: pre-line;
  line-height: 1.6;
  font-size: 1.1rem;
  text-align: center;
  padding: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.5rem;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #00BCD4;
  font-size: 1.1rem;
  padding: 2rem;
`;

const ErrorText = styled.div`
  text-align: center;
  color: #ff6b6b;
  font-size: 1.1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const RetryButton = styled(motion.button)`
  background: #00BCD4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #26C6DA;
  }
`;

const Lyrics: React.FC<LyricsProps> = ({ trackName, artistName, isVisible, onClose }) => {
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevTrack = useRef({ trackName, artistName });

  const fetchLyrics = React.useCallback(async () => {
    if (!trackName || !artistName) return;
    
    // Don't fetch if it's the same track
    if (prevTrack.current.trackName === trackName && 
        prevTrack.current.artistName === artistName && 
        lyrics) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/lyrics?track=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName)}`);
      if (response.data && response.data.lyrics) {
        setLyrics(response.data.lyrics);
        prevTrack.current = { trackName, artistName };
      } else {
        setError('No lyrics found for this song');
        onClose(); // Close the lyrics panel if no lyrics are found
      }
    } catch (err) {
      setError('Failed to load lyrics');
      console.error('Error fetching lyrics:', err);
    } finally {
      setLoading(false);
    }
  }, [trackName, artistName, onClose, lyrics]);

  useEffect(() => {
    if (isVisible) {
      fetchLyrics();
    }
  }, [isVisible, fetchLyrics]);

  if (!isVisible) return null;

  return (
    <LyricsContainer isVisible={isVisible}>
      <LyricsHeader>
        <LyricsTitle>{trackName} - {artistName}</LyricsTitle>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </LyricsHeader>
      {loading ? (
        <LoadingText>Loading lyrics...</LoadingText>
      ) : error ? (
        <ErrorText>
          {error}
          <RetryButton
            onClick={fetchLyrics}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </RetryButton>
        </ErrorText>
      ) : (
        <LyricsContent>{lyrics}</LyricsContent>
      )}
    </LyricsContainer>
  );
};

export default Lyrics; 