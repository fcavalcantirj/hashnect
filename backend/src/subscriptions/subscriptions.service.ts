import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-04-30.basil',
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async createCheckoutSession(userId: string, planType: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Define price based on plan type
    let priceId: string;
    switch (planType) {
      case 'premium':
        priceId = 'price_premium'; // Replace with actual Stripe price ID
        break;
      case 'enterprise':
        priceId = 'price_enterprise'; // Replace with actual Stripe price ID
        break;
      default:
        throw new Error('Invalid plan type');
    }

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/subscription/cancel`,
      customer_email: user.email,
      client_reference_id: userId,
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        return this.handleCheckoutSessionCompleted(event.data.object);
      case 'customer.subscription.updated':
        return this.handleSubscriptionUpdated(event.data.object);
      case 'customer.subscription.deleted':
        return this.handleSubscriptionDeleted(event.data.object);
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(session: any) {
    const userId = session.client_reference_id;
    const stripeCustomerId = session.customer;
    const stripeSubscriptionId = session.subscription;

    // Create subscription in database
    return this.prisma.subscription.create({
      data: {
        userId,
        planType: 'premium', // Determine based on price ID
        status: 'active',
        stripeCustomerId,
        stripeSubscriptionId,
      },
    });
  }

  private async handleSubscriptionUpdated(subscription: any) {
    // Update subscription in database
    return this.prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: subscription.status,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: any) {
    // Update subscription in database
    return this.prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: 'canceled',
        endDate: new Date(),
      },
    });
  }

  async cancelSubscription(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found');
    }

    // Cancel subscription in Stripe
    await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Update subscription in database
    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'canceled',
        endDate: new Date(),
      },
    });
  }
}
