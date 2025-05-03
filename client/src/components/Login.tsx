import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaSpotify } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00BCD4 0%, #191414 100%);
  color: white;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  isolation: isolate;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 188, 212, 0.2) 0%, rgba(0, 188, 212, 0) 70%);
  pointer-events: none;
  z-index: 1;
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const IOSInstructions = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 188, 212, 0.2);
`;

const Button = styled(motion.button)`
  background: rgba(0, 188, 212, 0.1);
  color: white;
  border: 1px solid rgba(0, 188, 212, 0.3);
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 188, 212, 0.2);
    border-color: rgba(0, 188, 212, 0.5);
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin: 2rem 0 0;
  text-align: center;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(to right, #fff, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 188, 212, 0.3);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin: 1rem 0 3rem;
  text-align: center;
  opacity: 0.8;
  max-width: 600px;
  line-height: 1.6;
`;

function Login() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  const handleLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      alert('Missing environment variables. Please make sure your .env file is set up correctly.');
      return;
    }
    
    const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <Container>
      <BackgroundGlow />
      {isIOS && !isStandalone && (
        <IOSInstructions>
          For the best experience, please open in Safari and add to your home screen
        </IOSInstructions>
      )}
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Noctify
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your desk media player
        </Subtitle>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FaSpotify size={24} />
          Connect with Spotify
        </Button>
      </ContentWrapper>
    </Container>
  );
}

export default Login; 
