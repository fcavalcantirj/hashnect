import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { subdomainService } from '../services/api';

const SubdomainsContainer = styled.div`
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

const SubdomainCard = styled.div`
  background: var(--surface-color);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const SubdomainHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const SubdomainIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const SubdomainInfo = styled.div`
  flex: 1;
`;

const SubdomainName = styled.h3`
  font-size: 18px;
  margin: 0 0 4px;
  color: var(--text-primary);
`;

const SubdomainDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
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

const Subdomains: React.FC = () => {
  const [subdomains, setSubdomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubdomains = async () => {
      try {
        const data = await subdomainService.getSubdomains();
        setSubdomains(data);
      } catch (err) {
        setError('Failed to load subdomains');
        console.error('Error fetching subdomains:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubdomains();
  }, []);

  if (loading) {
    return <SubdomainsContainer>Loading...</SubdomainsContainer>;
  }

  if (error) {
    return <SubdomainsContainer>{error}</SubdomainsContainer>;
  }

  return (
    <SubdomainsContainer>
      <Header>
        <Title>Subdomains</Title>
        <Subtitle>Communities you're part of</Subtitle>
      </Header>

      <Grid>
        {subdomains.map(subdomain => (
          <SubdomainCard key={subdomain.id}>
            <SubdomainHeader>
              <SubdomainIcon>@</SubdomainIcon>
              <SubdomainInfo>
                <SubdomainName>@{subdomain.name}</SubdomainName>
                <SubdomainDescription>{subdomain.description}</SubdomainDescription>
              </SubdomainInfo>
            </SubdomainHeader>
            <Stats>
              <Stat>
                <StatValue>{subdomain.usersCount}</StatValue>
                <StatLabel>Users</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{subdomain.connectionsCount}</StatValue>
                <StatLabel>Connections</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{subdomain.hashtagsCount}</StatValue>
                <StatLabel>Hashtags</StatLabel>
              </Stat>
            </Stats>
          </SubdomainCard>
        ))}
      </Grid>
    </SubdomainsContainer>
  );
};

export default Subdomains; 