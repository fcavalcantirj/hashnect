import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, authService } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://hashnect.onrender.com:3001';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      console.log('AuthCallback: token from URL:', token);
      
      if (token) {
        localStorage.setItem('token', token);
        try {
          const response = await fetch(`${API_URL}/api/users/self`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('AuthCallback: /api/users/self response:', response);
          console.log('AuthCallback: response status:', response.status);
          console.log('AuthCallback: response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const user = await response.json();
          console.log('AuthCallback: user data:', user);
          
          if (user && user.data) {
            localStorage.setItem('user', JSON.stringify(user.data));
            console.log('AuthCallback: user stored:', user.data);
            navigate('/');
          } else {
            throw new Error('No user data received');
          }
        } catch (err) {
          console.error('AuthCallback: fetch error:', err);
          authService.logout();
        }
      } else {
        console.error('AuthCallback: No token in URL');
        authService.logout();
      }
    };
    handleAuth();
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default AuthCallback; 