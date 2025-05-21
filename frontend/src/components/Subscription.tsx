import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { subscriptionService } from '../services/api';

const SubscriptionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
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

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 48px;
`;

const PlanCard = styled.div<{ isCurrent?: boolean }>`
  background: var(--surface-color);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid ${props => props.isCurrent ? 'var(--primary-color)' : 'transparent'};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }
`;

const CurrentPlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-color);
  color: white;
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
`;

const PlanName = styled.h2`
  font-size: 24px;
  margin: 0 0 16px;
  color: var(--text-primary);
`;

const PlanPrice = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 24px;
  
  span {
    font-size: 16px;
    font-weight: 400;
    color: var(--text-secondary);
  }
`;

const PlanDescription = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 24px;
  line-height: 1.6;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  text-align: left;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 14px;
  
  &:before {
    content: '✓';
    color: var(--primary-color);
    font-weight: bold;
  }
`;

const SubscribeButton = styled.button<{ isCurrent?: boolean }>`
  background: ${props => props.isCurrent ? 'var(--surface-color)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'};
  color: ${props => props.isCurrent ? 'var(--text-secondary)' : 'white'};
  border: ${props => props.isCurrent ? '1px solid var(--text-secondary)' : 'none'};
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.isCurrent ? 'default' : 'pointer'};
  transition: opacity 0.2s;
  
  &:hover {
    opacity: ${props => props.isCurrent ? 1 : 0.9};
  }
`;

const Subscription: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Basic features for casual users',
      features: [
        'Up to 100 connections',
        'Basic profile customization',
        'Access to public hashtags',
        'Standard support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      description: 'Advanced features for power users',
      features: [
        'Unlimited connections',
        'Advanced profile customization',
        'Access to all hashtags',
        'Priority support',
        'Custom subdomains',
        'Analytics dashboard'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 29.99,
      description: 'Full features for organizations',
      features: [
        'Everything in Pro',
        'Team management',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics'
      ]
    }
  ];

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const data = await subscriptionService.getCurrentPlan();
        setCurrentPlan(data);
      } catch (err) {
        setError('Failed to load subscription information');
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const handleSubscribe = async (planId: string) => {
    try {
      await subscriptionService.subscribe(planId);
      // Refresh current plan
      const data = await subscriptionService.getCurrentPlan();
      setCurrentPlan(data);
    } catch (err) {
      console.error('Error subscribing to plan:', err);
    }
  };

  if (loading) {
    return <SubscriptionContainer>Loading...</SubscriptionContainer>;
  }

  if (error) {
    return <SubscriptionContainer>{error}</SubscriptionContainer>;
  }

  return (
    <SubscriptionContainer>
      <Header>
        <Title>Subscription Plans</Title>
        <Subtitle>Choose the plan that best fits your needs</Subtitle>
      </Header>

      <PlansGrid>
        {plans.map(plan => (
          <PlanCard key={plan.id} isCurrent={currentPlan?.id === plan.id}>
            {currentPlan?.id === plan.id && (
              <CurrentPlanBadge>Current Plan</CurrentPlanBadge>
            )}
            <PlanName>{plan.name}</PlanName>
            <PlanPrice>
              ${plan.price}
              <span>/month</span>
            </PlanPrice>
            <PlanDescription>{plan.description}</PlanDescription>
            <FeaturesList>
              {plan.features.map((feature, index) => (
                <Feature key={index}>{feature}</Feature>
              ))}
            </FeaturesList>
            <SubscribeButton
              isCurrent={currentPlan?.id === plan.id}
              onClick={() => handleSubscribe(plan.id)}
            >
              {currentPlan?.id === plan.id ? 'Current Plan' : 'Subscribe'}
            </SubscribeButton>
          </PlanCard>
        ))}
      </PlansGrid>
    </SubscriptionContainer>
  );
};

export default Subscription; 