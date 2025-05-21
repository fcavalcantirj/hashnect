import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ConnectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 16px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: var(--text-secondary);
`;

const ConnectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const ConnectionCard = styled.div`
  background-color: var(--surface-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const ConnectionHeader = styled.div<{ strength: number }>`
  position: relative;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  opacity: ${props => 0.3 + props.strength * 0.7};
`;

const ConnectionAvatar = styled.div<{ verified: number }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 40px;
  left: 24px;
  border: 4px solid var(--surface-color);
  box-shadow: ${props => props.verified > 0 ? `0 0 ${props.verified * 4}px var(--verification-glow)` : 'none'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ConnectionContent = styled.div`
  padding: 48px 24px 24px;
`;

const ConnectionName = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;

const ConnectionEmail = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
`;

const ConnectionStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ConnectionStat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const ConnectionStrength = styled.div`
  margin-bottom: 16px;
`;

const StrengthLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
`;

const StrengthBar = styled.div`
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const StrengthFill = styled.div<{ strength: number }>`
  height: 100%;
  width: ${props => props.strength * 100}%;
  background: linear-gradient(
    to right,
    var(--primary-color),
    var(--secondary-color)
  );
  border-radius: 3px;
`;

const ConnectionActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 0;
  font-size: 14px;
  border-radius: 4px;
`;

const Connections: React.FC = () => {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for prototype
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setConnections([
        {
          id: '2',
          fullName: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          strength: 0.8,
          verificationLevel: 2,
          mutualConnections: 5,
          mutualInterests: 3
        },
        {
          id: '3',
          fullName: 'Michael Chen',
          email: 'michael.chen@example.com',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          strength: 0.6,
          verificationLevel: 1,
          mutualConnections: 3,
          mutualInterests: 2
        },
        {
          id: '4',
          fullName: 'Emma Davis',
          email: 'emma.davis@example.com',
          avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
          strength: 0.7,
          verificationLevel: 0,
          mutualConnections: 2,
          mutualInterests: 4
        },
        {
          id: '5',
          fullName: 'James Wilson',
          email: 'james.wilson@example.com',
          avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
          strength: 0.5,
          verificationLevel: 0,
          mutualConnections: 1,
          mutualInterests: 2
        },
        {
          id: '6',
          fullName: 'Olivia Martinez',
          email: 'olivia.martinez@example.com',
          avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
          strength: 0.9,
          verificationLevel: 3,
          mutualConnections: 7,
          mutualInterests: 5
        },
        {
          id: '7',
          fullName: 'Noah Thompson',
          email: 'noah.thompson@example.com',
          avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
          strength: 0.4,
          verificationLevel: 1,
          mutualConnections: 2,
          mutualInterests: 1
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return <div>Loading connections...</div>;
  }
  
  return (
    <ConnectionsContainer>
      <PageHeader>
        <Title>Your Connections</Title>
        <Description>Manage your network and strengthen your relationships</Description>
      </PageHeader>
      
      <ConnectionsGrid>
        {connections.map(connection => (
          <ConnectionCard key={connection.id}>
            <ConnectionHeader strength={connection.strength} />
            <ConnectionAvatar verified={connection.verificationLevel}>
              <img src={connection.avatar} alt={connection.fullName} />
            </ConnectionAvatar>
            <ConnectionContent>
              <ConnectionName>{connection.fullName}</ConnectionName>
              <ConnectionEmail>{connection.email}</ConnectionEmail>
              
              <ConnectionStats>
                <ConnectionStat>
                  <StatValue>{connection.mutualConnections}</StatValue>
                  <StatLabel>Mutual Connections</StatLabel>
                </ConnectionStat>
                <ConnectionStat>
                  <StatValue>{connection.mutualInterests}</StatValue>
                  <StatLabel>Mutual Interests</StatLabel>
                </ConnectionStat>
                <ConnectionStat>
                  <StatValue>{connection.verificationLevel}</StatValue>
                  <StatLabel>Verification</StatLabel>
                </ConnectionStat>
              </ConnectionStats>
              
              <ConnectionStrength>
                <StrengthLabel>
                  <span>Connection Strength</span>
                  <span>{Math.round(connection.strength * 100)}%</span>
                </StrengthLabel>
                <StrengthBar>
                  <StrengthFill strength={connection.strength} />
                </StrengthBar>
              </ConnectionStrength>
              
              <ConnectionActions>
                <ActionButton>View Profile</ActionButton>
                <ActionButton style={{ background: 'transparent', border: '1px solid #424242' }}>
                  Message
                </ActionButton>
              </ConnectionActions>
            </ConnectionContent>
          </ConnectionCard>
        ))}
      </ConnectionsGrid>
    </ConnectionsContainer>
  );
};

export default Connections;
