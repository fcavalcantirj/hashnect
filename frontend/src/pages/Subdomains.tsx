import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SubdomainsContainer = styled.div`
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

const SubdomainsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const SubdomainCard = styled.div<{ isPrivate: boolean }>`
  background-color: var(--surface-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  border: ${props => props.isPrivate ? '1px solid var(--primary-color)' : 'none'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const SubdomainHeader = styled.div<{ isPrivate: boolean }>`
  height: 120px;
  background: ${props => props.isPrivate 
    ? 'linear-gradient(135deg, rgba(98, 0, 234, 0.3), rgba(98, 0, 234, 0.1))'
    : 'linear-gradient(135deg, rgba(3, 218, 198, 0.3), rgba(3, 218, 198, 0.1))'
  };
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubdomainIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const PrivateBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const SubdomainContent = styled.div`
  padding: 24px;
`;

const SubdomainName = styled.h2`
  font-size: 20px;
  margin-bottom: 8px;
  text-align: center;
`;

const SubdomainDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
`;

const SubdomainStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const SubdomainStat = styled.div`
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

const MembersList = styled.div`
  margin-bottom: 24px;
`;

const MembersListTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--text-primary);
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const MemberAvatar = styled.div`
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

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const MemberRole = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const SubdomainActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 0;
  font-size: 14px;
  border-radius: 4px;
`;

const CreateButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const Subdomains: React.FC = () => {
  const [subdomains, setSubdomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for prototype
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setSubdomains([
        {
          id: 's1',
          name: 'Tech Enthusiasts',
          description: 'A community for technology lovers and innovators',
          isPrivate: false,
          memberCount: 156,
          connectionCount: 423,
          hashtagCount: 12,
          owner: { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
          members: [
            { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'owner' },
            { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'admin' },
            { id: '3', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', role: 'member' },
          ]
        },
        {
          id: 's2',
          name: 'Design Community',
          description: 'For designers and creative professionals',
          isPrivate: false,
          memberCount: 98,
          connectionCount: 245,
          hashtagCount: 8,
          owner: { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
          members: [
            { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'owner' },
            { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'member' },
            { id: '4', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', role: 'member' },
          ]
        },
        {
          id: 's3',
          name: 'AI Researchers',
          description: 'Artificial Intelligence research and discussion',
          isPrivate: true,
          memberCount: 42,
          connectionCount: 187,
          hashtagCount: 15,
          owner: { id: '3', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
          members: [
            { id: '3', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', role: 'owner' },
            { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'admin' },
            { id: '5', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', role: 'member' },
          ]
        },
        {
          id: 's4',
          name: 'Photography Club',
          description: 'Share your photography and get inspired',
          isPrivate: false,
          memberCount: 127,
          connectionCount: 356,
          hashtagCount: 10,
          owner: { id: '4', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
          members: [
            { id: '4', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', role: 'owner' },
            { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'member' },
            { id: '5', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', role: 'member' },
          ]
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return <div>Loading subdomains...</div>;
  }
  
  return (
    <SubdomainsContainer>
      <PageHeader>
        <Title>Your Subdomains</Title>
        <Description>Explore and manage your community spaces</Description>
      </PageHeader>
      
      <SubdomainsGrid>
        {subdomains.map(subdomain => (
          <SubdomainCard key={subdomain.id} isPrivate={subdomain.isPrivate}>
            <SubdomainHeader isPrivate={subdomain.isPrivate}>
              <SubdomainIcon>
                {subdomain.name.substring(0, 1)}
              </SubdomainIcon>
              {subdomain.isPrivate && <PrivateBadge>Private</PrivateBadge>}
            </SubdomainHeader>
            <SubdomainContent>
              <SubdomainName>{subdomain.name}</SubdomainName>
              <SubdomainDescription>{subdomain.description}</SubdomainDescription>
              
              <SubdomainStats>
                <SubdomainStat>
                  <StatValue>{subdomain.memberCount}</StatValue>
                  <StatLabel>Members</StatLabel>
                </SubdomainStat>
                <SubdomainStat>
                  <StatValue>{subdomain.connectionCount}</StatValue>
                  <StatLabel>Connections</StatLabel>
                </SubdomainStat>
                <SubdomainStat>
                  <StatValue>{subdomain.hashtagCount}</StatValue>
                  <StatLabel>Hashtags</StatLabel>
                </SubdomainStat>
              </SubdomainStats>
              
              <MembersList>
                <MembersListTitle>Key Members</MembersListTitle>
                {subdomain.members.map(member => (
                  <MemberItem key={member.id}>
                    <MemberAvatar>
                      <img src={member.avatar} alt={member.name} />
                    </MemberAvatar>
                    <MemberInfo>
                      <MemberName>{member.name}</MemberName>
                      <MemberRole>{member.role}</MemberRole>
                    </MemberInfo>
                  </MemberItem>
                ))}
              </MembersList>
              
              <SubdomainActions>
                <ActionButton>Enter Space</ActionButton>
                <ActionButton style={{ background: 'transparent', border: '1px solid #424242' }}>
                  Invite
                </ActionButton>
              </SubdomainActions>
            </SubdomainContent>
          </SubdomainCard>
        ))}
      </SubdomainsGrid>
      
      <CreateButton title="Create New Subdomain">+</CreateButton>
    </SubdomainsContainer>
  );
};

export default Subdomains;
