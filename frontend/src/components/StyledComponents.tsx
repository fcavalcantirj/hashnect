import React from 'react';
import styled from 'styled-components';

// Responsive media queries
const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1200px',
};

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  laptop: `@media (max-width: ${breakpoints.laptop})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
};

// Common styled components for reuse across the application
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  
  ${media.tablet} {
    padding: 0 24px;
  }
  
  ${media.mobile} {
    padding: 0 16px;
  }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 16px;
  max-width: 1200px;
  margin: 0 auto;
  
  ${media.tablet} {
    padding: 24px 16px;
  }
  
  ${media.mobile} {
    padding: 16px 12px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
  
  ${media.mobile} {
    margin-bottom: 24px;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
  
  ${media.mobile} {
    font-size: 24px;
  }
`;

export const Description = styled.p`
  color: var(--text-secondary);
  
  ${media.mobile} {
    font-size: 14px;
  }
`;

export const Card = styled.div`
  background-color: var(--surface-color);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  ${media.mobile} {
    padding: 16px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  
  ${media.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #7c4dff;
  }
  
  &:disabled {
    background-color: #303030;
    color: var(--text-disabled);
    cursor: not-allowed;
  }
  
  ${media.mobile} {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const Input = styled.input`
  background-color: #303030;
  border: 1px solid #424242;
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  ${media.mobile} {
    padding: 8px;
    font-size: 14px;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  ${media.mobile} {
    gap: 12px;
  }
`;

export const Avatar = styled.div<{ size?: string; verified?: number }>`
  width: ${props => props.size || '48px'};
  height: ${props => props.size || '48px'};
  border-radius: 50%;
  overflow: hidden;
  box-shadow: ${props => props.verified && props.verified > 0 ? `0 0 ${props.verified * 4}px var(--verification-glow)` : 'none'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  ${media.mobile} {
    width: ${props => props.size ? `calc(${props.size} * 0.8)` : '40px'};
    height: ${props => props.size ? `calc(${props.size} * 0.8)` : '40px'};
  }
`;

// Export all styled components
export default {
  Container,
  PageContainer,
  PageHeader,
  Title,
  Description,
  Card,
  Grid,
  Button,
  Input,
  FlexRow,
  FlexColumn,
  Avatar,
  media
};
