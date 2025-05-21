import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { hashtagService } from '../services/api';

const HashtagsContainer = styled.div`
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

const HashtagCard = styled.div`
  background: var(--surface-color);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const HashtagHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const HashtagIcon = styled.div`
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

const HashtagInfo = styled.div`
  flex: 1;
`;

const HashtagName = styled.h3`
  font-size: 18px;
  margin: 0 0 4px;
  color: var(--text-primary);
`;

const HashtagDescription = styled.p`
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

const Hashtags: React.FC = () => {
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const data = await hashtagService.getHashtags();
        setHashtags(data);
      } catch (err) {
        setError('Failed to load hashtags');
        console.error('Error fetching hashtags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  if (loading) {
    return <HashtagsContainer>Loading...</HashtagsContainer>;
  }

  if (error) {
    return <HashtagsContainer>{error}</HashtagsContainer>;
  }

  return (
    <HashtagsContainer>
      <Header>
        <Title>Hashtags</Title>
        <Subtitle>Topics you're interested in</Subtitle>
      </Header>

      <Grid>
        {hashtags.map(hashtag => (
          <HashtagCard key={hashtag.id}>
            <HashtagHeader>
              <HashtagIcon>#</HashtagIcon>
              <HashtagInfo>
                <HashtagName>#{hashtag.name}</HashtagName>
                <HashtagDescription>{hashtag.description}</HashtagDescription>
              </HashtagInfo>
            </HashtagHeader>
            <Stats>
              <Stat>
                <StatValue>{hashtag.usersCount}</StatValue>
                <StatLabel>Users</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{hashtag.connectionsCount}</StatValue>
                <StatLabel>Connections</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{hashtag.subdomainsCount}</StatValue>
                <StatLabel>Subdomains</StatLabel>
              </Stat>
            </Stats>
          </HashtagCard>
        ))}
      </Grid>
    </HashtagsContainer>
  );
};

export default Hashtags; 