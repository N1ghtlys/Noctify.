import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00BCD4 0%, #191414 100%);
  color: white;
  padding: 1rem;
`;

const LoadingText = styled(motion.h2)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00BCD4;
  text-align: center;
`;

const ErrorText = styled(motion.h2)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
  text-align: center;
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #00BCD4;
  border-radius: 50%;
`;

const RetryButton = styled(motion.button)`
  background: #00BCD4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: #26C6DA;
  }
`;

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      navigate('/login');
      return;
    }

    const handleLogin = async () => {
      try {
        const redirectUri = process.env.REACT_APP_REDIRECT_URI;
        const apiUrl = process.env.REACT_APP_API_URL;
        
        if (!redirectUri || !apiUrl) {
          setError('Missing environment variables. Please check your configuration.');
          return;
        }
        
        const response = await axios.post(apiUrl, { 
          code,
          redirectUri
        });
        const { accessToken, refreshToken, expiresIn } = response.data;

        // Store tokens securely
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('tokenExpiration', String(Date.now() + expiresIn * 1000));

        navigate('/');
      } catch (error) {
        console.error('Authentication failed:', error);
        setError('Failed to connect to Spotify. Please try again.');
      }
    };

    handleLogin();
  }, [navigate]);

  const handleRetry = () => {
    setError(null);
    navigate('/login');
  };

  return (
    <Container>
      {error ? (
        <>
          <ErrorText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </ErrorText>
          <RetryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
          >
            Try Again
          </RetryButton>
        </>
      ) : (
        <>
          <LoadingText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Connecting to Spotify...
          </LoadingText>
          <Spinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
    </Container>
  );
}

export default Callback; 