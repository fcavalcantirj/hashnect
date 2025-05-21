import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connectionService } from '../services/api';

const ConnectionsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin: 0 0 8px;
  color: var(--text-primary);
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const ConnectionCard = styled(Link)`
  background: var(--surface-color);
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const ConnectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const Avatar = styled.div<{ verified: number }>`
  width: 48px;
  height: 48px;
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

const ConnectionInfo = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  font-size: 18px;
  margin: 0 0 4px;
  color: var(--text-primary);
`;

const Username = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
`;

const Bio = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Stat = styled.div`
  flex: 1;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const Connections: React.FC = () => {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await connectionService.getConnections();
        setConnections(data);
      } catch (err) {
        setError('Failed to load connections');
        console.error('Error fetching connections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) {
    return <ConnectionsContainer>Loading...</ConnectionsContainer>;
  }

  if (error) {
    return <ConnectionsContainer>{error}</ConnectionsContainer>;
  }

  return (
    <ConnectionsContainer>
      <Header>
        <Title>Connections</Title>
        <Subtitle>People you're connected with</Subtitle>
      </Header>

      <Grid>
        {connections.map(connection => (
          <ConnectionCard key={connection.id} to={`/profile/${connection.id}`}>
            <ConnectionHeader>
              <Avatar verified={connection.verificationLevel || 0}>
                <img src={connection.avatar} alt={connection.fullName} />
              </Avatar>
              <ConnectionInfo>
                <Name>{connection.fullName}</Name>
                <Username>@{connection.username}</Username>
              </ConnectionInfo>
            </ConnectionHeader>
            <Bio>{connection.bio}</Bio>
            <Stats>
              <Stat>
                <StatValue>{connection.connectionsCount}</StatValue>
                <StatLabel>Connections</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{connection.hashtagsCount}</StatValue>
                <StatLabel>Hashtags</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{connection.subdomainsCount}</StatValue>
                <StatLabel>Subdomains</StatLabel>
              </Stat>
            </Stats>
          </ConnectionCard>
        ))}
      </Grid>
    </ConnectionsContainer>
  );
};

export default Connections; 