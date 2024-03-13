import { Stripe } from 'stripe';

import { config } from '@/config';

export const stripe = new Stripe(config.APP.STRIPE_API_KEY, {
  apiVersion: '2023-10-16',
});
