import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HashtagsContainer = styled.div`
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

const SearchBar = styled.div`
  margin-bottom: 32px;
  display: flex;
  gap: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: var(--surface-color);
  border: 1px solid #424242;
  color: var(--text-primary);
  font-size: 16px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: 0 24px;
  border-radius: 8px;
  background: linear-gradient(45deg, var(--primary-color), #7c4dff);
  color: white;
  font-weight: 500;
`;

const HashtagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const HashtagCard = styled.div`
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

const HashtagHeader = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, rgba(3, 218, 198, 0.2), rgba(98, 0, 234, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HashtagName = styled.h2`
  font-size: 24px;
  color: var(--secondary-color);
`;

const HashtagContent = styled.div`
  padding: 24px;
`;

const HashtagStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const HashtagStat = styled.div`
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

const UsersList = styled.div`
  margin-bottom: 24px;
`;

const UsersListTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--text-primary);
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const HashtagActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 0;
  font-size: 14px;
  border-radius: 4px;
`;

const Hashtags: React.FC = () => {
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for prototype
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setHashtags([
        {
          id: 'h1',
          name: '#technology',
          userCount: 1245,
          connectionCount: 3782,
          trending: true,
          users: [
            { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { id: '5', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/91.jpg' },
          ]
        },
        {
          id: 'h2',
          name: '#design',
          userCount: 987,
          connectionCount: 2541,
          trending: true,
          users: [
            { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: '3', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
          ]
        },
        {
          id: 'h3',
          name: '#art',
          userCount: 1532,
          connectionCount: 4210,
          trending: false,
          users: [
            { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { id: '4', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
          ]
        },
        {
          id: 'h4',
          name: '#music',
          userCount: 2145,
          connectionCount: 5632,
          trending: true,
          users: [
            { id: '3', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
            { id: '4', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
            { id: '5', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/91.jpg' },
          ]
        },
        {
          id: 'h5',
          name: '#travel',
          userCount: 1876,
          connectionCount: 4321,
          trending: false,
          users: [
            { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: '4', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
          ]
        },
        {
          id: 'h6',
          name: '#photography',
          userCount: 1432,
          connectionCount: 3654,
          trending: false,
          users: [
            { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { id: '5', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/91.jpg' },
          ]
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return <div>Loading hashtags...</div>;
  }
  
  return (
    <HashtagsContainer>
      <PageHeader>
        <Title>Explore Hashtags</Title>
        <Description>Discover communities and connect through shared interests</Description>
      </PageHeader>
      
      <SearchBar>
        <SearchInput placeholder="Search hashtags..." />
        <SearchButton>Search</SearchButton>
      </SearchBar>
      
      <HashtagsGrid>
        {hashtags.map(hashtag => (
          <HashtagCard key={hashtag.id}>
            <HashtagHeader>
              <HashtagName>{hashtag.name}</HashtagName>
            </HashtagHeader>
            <HashtagContent>
              <HashtagStats>
                <HashtagStat>
                  <StatValue>{hashtag.userCount}</StatValue>
                  <StatLabel>Users</StatLabel>
                </HashtagStat>
                <HashtagStat>
                  <StatValue>{hashtag.connectionCount}</StatValue>
                  <StatLabel>Connections</StatLabel>
                </HashtagStat>
                <HashtagStat>
                  <StatValue>{hashtag.trending ? '🔥' : '—'}</StatValue>
                  <StatLabel>Trending</StatLabel>
                </HashtagStat>
              </HashtagStats>
              
              <UsersList>
                <UsersListTitle>Connected Users</UsersListTitle>
                {hashtag.users.map(user => (
                  <UserItem key={user.id}>
                    <UserAvatar>
                      <img src={user.avatar} alt={user.name} />
                    </UserAvatar>
                    <UserName>{user.name}</UserName>
                  </UserItem>
                ))}
              </UsersList>
              
              <HashtagActions>
                <ActionButton>Follow</ActionButton>
                <ActionButton style={{ background: 'transparent', border: '1px solid #424242' }}>
                  View Network
                </ActionButton>
              </HashtagActions>
            </HashtagContent>
          </HashtagCard>
        ))}
      </HashtagsGrid>
    </HashtagsContainer>
  );
};

export default Hashtags;
