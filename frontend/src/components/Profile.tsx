import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { userService } from '../services/api';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const Avatar = styled.div<{ verified: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  box-shadow: ${props => props.verified > 0 ? `0 0 ${props.verified * 8}px var(--verification-glow)` : 'none'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 32px;
  margin: 0 0 8px;
  color: var(--text-primary);
`;

const Username = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0 0 16px;
`;

const Bio = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 32px;
`;

const StatCard = styled.div`
  background: var(--surface-color);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const HashtagsSection = styled.div`
  margin-top: 32px;
`;

const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Hashtag = styled.div`
  background: var(--surface-color);
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HashtagStrength = styled.span`
  color: var(--primary-color);
  font-weight: 600;
`;

const EditButton = styled.button`
  margin-top: 16px;
  padding: 8px 20px;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: var(--primary-color-dark);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #181828;
  padding: 32px;
  border-radius: 12px;
  min-width: 350px;
  max-width: 90vw;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ModalInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #22223a;
  color: #fff;
`;

const ModalInputTag = styled.input`
  width: 100%;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #22223a;
  color: #fff;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalFocus, setModalFocus] = useState<'bio' | 'hashtags' | null>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const hashtagsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        const data = await userService.getProfile(id);
        console.log('Profile data received:', data);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (showModal) {
      if (modalFocus === 'bio' && bioRef.current) bioRef.current.focus();
      if (modalFocus === 'hashtags' && hashtagsRef.current) hashtagsRef.current.focus();
    }
  }, [showModal, modalFocus]);

  const openEditModal = (focus: 'bio' | 'hashtags' | null = null) => {
    setEditBio(profile?.bio || '');
    setEditHashtags(profile?.hashtags?.map((h: any) => h.name).join(', ') || '');
    setModalFocus(focus);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = async () => {
    setSaving(true);
    const hashtagsArray = editHashtags.split(',').map(h => h.trim()).filter(Boolean);
    console.log('Saving bio:', editBio);
    console.log('Saving hashtags:', hashtagsArray);
    try {
      const response = await userService.updateProfile(id!, {
        bio: editBio,
        hashtags: hashtagsArray
      });
      console.log('Update response:', response);
      setShowModal(false);
      setLoading(true);
      const data = await userService.getProfile(id!);
      setProfile(data);
    } catch (e) {
      console.error('Failed to save:', e);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileContainer>Loading...</ProfileContainer>;
  }

  if (error || !profile) {
    return <ProfileContainer>{error || 'Profile not found'}</ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar verified={profile.verificationLevel || 0}>
          <img src={profile.avatar} alt={profile.fullName} />
        </Avatar>
        <ProfileInfo>
          <Name>{profile.fullName}</Name>
          <Username>@{profile.username}</Username>
          <EditButton onClick={() => openEditModal(null)}>Edit Profile</EditButton>
        </ProfileInfo>
      </ProfileHeader>

      <Stats>
        <StatCard>
          <StatValue>{profile.connectionsCount}</StatValue>
          <StatLabel>Connections</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{profile.hashtagsCount}</StatValue>
          <StatLabel>Hashtags</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{profile.subdomainsCount}</StatValue>
          <StatLabel>Subdomains</StatLabel>
        </StatCard>
      </Stats>

      <HashtagsSection>
        <h2>Hashtags</h2>
        {profile.hashtags && profile.hashtags.length > 0 ? (
          <HashtagList>
            {profile.hashtags.map((hashtag: any) => (
              <Hashtag key={hashtag.id}>
                #{hashtag.name}
                <HashtagStrength>{hashtag.strength}%</HashtagStrength>
              </Hashtag>
            ))}
          </HashtagList>
        ) : (
          <div>No hashtags yet. <span style={{color: 'var(--primary-color)', cursor: 'pointer'}} onClick={() => openEditModal('hashtags')}>Add your first hashtag!</span></div>
        )}
      </HashtagsSection>

      <div style={{marginTop: 32}}>
        <h2>Bio</h2>
        {profile.bio ? (
          <Bio>{profile.bio}</Bio>
        ) : (
          <div>No bio yet. <span style={{color: 'var(--primary-color)', cursor: 'pointer'}} onClick={() => openEditModal('bio')}>Add something about yourself!</span></div>
        )}
      </div>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Edit Profile</ModalTitle>
            <label>Bio:</label>
            <ModalInput ref={bioRef} value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Tell us about yourself..." />
            <label>Hashtags (comma separated):</label>
            <ModalInputTag ref={hashtagsRef} value={editHashtags} onChange={e => setEditHashtags(e.target.value)} placeholder="#ai, #webdev, #music" />
            <ModalActions>
              <EditButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</EditButton>
              <EditButton style={{background: '#444'}} onClick={closeModal}>Cancel</EditButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

export default Profile; 