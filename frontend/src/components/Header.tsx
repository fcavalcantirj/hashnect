import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/api';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  
  span {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const AuthButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const UserAvatar = styled.div<{ verified: number }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  box-shadow: ${props => props.verified > 0 ? `0 0 ${props.verified * 4}px var(--verification-glow)` : 'none'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/');
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <span>Hashnect</span>
        </Logo>
        
        <Nav>
          {user ? (
            <>
              <NavLink to={`/profile/${user.id}`}>Profile</NavLink>
              <NavLink to="/connections">Connections</NavLink>
              <NavLink to="/hashtags">Hashtags</NavLink>
              <NavLink to="/subdomains">Subdomains</NavLink>
              <NavLink to="/subscription">Subscription</NavLink>
              <UserAvatar verified={user.verificationLevel || 0}>
                <img src={user.avatar} alt={user.fullName} />
              </UserAvatar>
              <AuthButton onClick={handleLogout}>Logout</AuthButton>
            </>
          ) : (
            <AuthButton onClick={() => authService.login()}>Login with Google</AuthButton>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
