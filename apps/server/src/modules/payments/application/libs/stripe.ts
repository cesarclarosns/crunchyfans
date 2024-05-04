import { Stripe } from 'stripe';

import { settings } from '@/config/settings';

export const stripe = new Stripe(settings.PAYMENTS.STRIPE_API_KEY, {
  apiVersion: '2023-10-16',
});
