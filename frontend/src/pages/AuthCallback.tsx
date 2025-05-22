import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('No token found in URL');
        }

        // Handle the auth callback
        const userData = await authService.handleAuthCallback(token);
        
        // Update global auth state
        setUser(userData);

        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [location, navigate, setUser]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%)',
      color: '#fff'
    }}>
      <div style={{ fontSize: 24, marginBottom: 16 }}>Completing login...</div>
      <div className="spinner" style={{ 
        border: '4px solid #23234d', 
        borderTop: '4px solid #bb86fc', 
        borderRadius: '50%', 
        width: 48, 
        height: 48, 
        animation: 'spin 1s linear infinite' 
      }} />
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};

export default AuthCallback; 