import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SubscriptionContainer = styled.div`
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

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const PlanCard = styled.div<{ isPremium?: boolean }>`
  background-color: var(--surface-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  border: ${props => props.isPremium ? '2px solid var(--primary-color)' : 'none'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const PlanHeader = styled.div<{ isPremium?: boolean }>`
  padding: 24px;
  background: ${props => props.isPremium 
    ? 'linear-gradient(135deg, var(--primary-color), #7c4dff)'
    : 'var(--surface-color)'
  };
  text-align: center;
`;

const PlanName = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
`;

const PlanPrice = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  
  span {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.8;
  }
`;

const PlanDescription = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
`;

const PlanContent = styled.div`
  padding: 24px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-bottom: 24px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  
  svg {
    flex-shrink: 0;
    color: var(--secondary-color);
  }
`;

const PlanButton = styled.button<{ isPrimary?: boolean }>`
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  background: ${props => props.isPrimary 
    ? 'linear-gradient(135deg, var(--primary-color), #7c4dff)'
    : 'transparent'
  };
  color: ${props => props.isPrimary ? 'white' : 'var(--text-primary)'};
  border: ${props => props.isPrimary ? 'none' : '1px solid #424242'};
`;

const CurrentSubscription = styled.div`
  background-color: var(--surface-color);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 48px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const SubscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SubscriptionTitle = styled.h2`
  font-size: 20px;
`;

const SubscriptionBadge = styled.div`
  background: linear-gradient(135deg, var(--primary-color), #7c4dff);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

const SubscriptionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const DetailItem = styled.div``;

const DetailLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const SubscriptionActions = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ isCancel?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background: ${props => props.isCancel ? 'transparent' : 'var(--primary-color)'};
  color: ${props => props.isCancel ? 'var(--error-color)' : 'white'};
  border: ${props => props.isCancel ? '1px solid var(--error-color)' : 'none'};
`;

const Subscription: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data for prototype
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setCurrentPlan({
        id: 'sub_123456',
        type: 'premium',
        status: 'active',
        startDate: '2025-04-15',
        endDate: '2026-04-15',
        nextBillingDate: '2025-05-15',
        amount: 9.99,
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <SubscriptionContainer>
      <PageHeader>
        <Title>Subscription Plans</Title>
        <Description>Choose the right plan for your networking needs</Description>
      </PageHeader>
      
      {currentPlan && (
        <CurrentSubscription>
          <SubscriptionHeader>
            <SubscriptionTitle>Your Current Subscription</SubscriptionTitle>
            <SubscriptionBadge>{currentPlan.type.charAt(0).toUpperCase() + currentPlan.type.slice(1)}</SubscriptionBadge>
          </SubscriptionHeader>
          
          <SubscriptionDetails>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{currentPlan.status.charAt(0).toUpperCase() + currentPlan.status.slice(1)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Start Date</DetailLabel>
              <DetailValue>{formatDate(currentPlan.startDate)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Renewal Date</DetailLabel>
              <DetailValue>{formatDate(currentPlan.endDate)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Next Billing</DetailLabel>
              <DetailValue>{formatDate(currentPlan.nextBillingDate)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Monthly Fee</DetailLabel>
              <DetailValue>${currentPlan.amount.toFixed(2)}</DetailValue>
            </DetailItem>
          </SubscriptionDetails>
          
          <SubscriptionActions>
            <ActionButton>Upgrade Plan</ActionButton>
            <ActionButton>Update Payment Method</ActionButton>
            <ActionButton isCancel>Cancel Subscription</ActionButton>
          </SubscriptionActions>
        </CurrentSubscription>
      )}
      
      <PlansContainer>
        <PlanCard>
          <PlanHeader>
            <PlanName>Free</PlanName>
            <PlanPrice>$0 <span>/month</span></PlanPrice>
            <PlanDescription>Basic features for personal use</PlanDescription>
          </PlanHeader>
          <PlanContent>
            <FeaturesList>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Basic 3D visualization
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Up to 50 connections
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Join public subdomains
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Basic profile customization
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Standard verification level
              </FeatureItem>
            </FeaturesList>
            
            <PlanButton>Current Plan</PlanButton>
          </PlanContent>
        </PlanCard>
        
        <PlanCard isPremium>
          <PlanHeader isPremium>
            <PlanName>Premium</PlanName>
            <PlanPrice>$9.99 <span>/month</span></PlanPrice>
            <PlanDescription>Enhanced features for power users</PlanDescription>
          </PlanHeader>
          <PlanContent>
            <FeaturesList>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Advanced 3D visualization
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Unlimited connections
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Create private subdomains
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Enhanced profile customization
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Priority verification level
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Advanced analytics
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Premium support
              </FeatureItem>
            </FeaturesList>
            
            <PlanButton isPrimary>Upgrade Now</PlanButton>
          </PlanContent>
        </PlanCard>
        
        <PlanCard>
          <PlanHeader>
            <PlanName>Enterprise</PlanName>
            <PlanPrice>$29.99 <span>/month</span></PlanPrice>
            <PlanDescription>Advanced features for organizations</PlanDescription>
          </PlanHeader>
          <PlanContent>
            <FeaturesList>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Premium 3D visualization
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Unlimited connections
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Multiple private subdomains
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Full profile customization
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Highest verification level
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Enterprise analytics
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                Dedicated support
              </FeatureItem>
              <FeatureItem>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z" />
                </svg>
                API access
              </FeatureItem>
            </FeaturesList>
            
            <PlanButton>Contact Sales</PlanButton>
          </PlanContent>
        </PlanCard>
      </PlansContainer>
    </SubscriptionContainer>
  );
};

export default Subscription;
