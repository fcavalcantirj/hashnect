import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Analytics } from '@vercel/analytics/react';
import NetworkGraph from './components/NetworkGraph';
import Header from './components/Header';
import Login from './pages/Login';
import Profile from './components/Profile';
import Connections from './components/Connections';
import Hashtags from './components/Hashtags';
import Subdomains from './components/Subdomains';
import Subscription from './components/Subscription';
import AuthCallback from './pages/AuthCallback';
import { authService } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-primary);
`;

const MainContent = styled.main`
  padding-top: 64px;
  min-height: calc(100vh - 64px);
`;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = authService.getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
          <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/"
                element={
                  user ? <NetworkGraph /> : <Login />
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/connections"
                element={
                  <PrivateRoute>
                    <Connections />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hashtags"
                element={
                  <PrivateRoute>
                    <Hashtags />
                  </PrivateRoute>
                }
              />
              <Route
                path="/subdomains"
                element={
                  <PrivateRoute>
                    <Subdomains />
                  </PrivateRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                }
              />
          </Routes>
          )}
        </MainContent>
        <Analytics />
      </AppContainer>
    </Router>
  );
};

export default App;
