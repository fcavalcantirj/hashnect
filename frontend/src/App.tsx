import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Analytics } from '@vercel/analytics/react';
import NetworkGraphWrapper from './components/NetworkGraphWrapper';
import Header from './components/Header';
import Login from './pages/Login';
import Profile from './components/Profile';
import Connections from './components/Connections';
import Hashtags from './components/Hashtags';
import Subdomains from './components/Subdomains';
import Subscription from './components/Subscription';
import AuthCallback from './pages/AuthCallback';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

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
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/"
        element={
          isAuthenticated ? <NetworkGraphWrapper /> : <Login />
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
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <AppRoutes />
          </MainContent>
          <Analytics />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

export default App;
