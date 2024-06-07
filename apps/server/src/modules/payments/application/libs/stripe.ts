import { Stripe } from 'stripe';

import { paymentsSettings } from '@/config';

export const stripe = new Stripe(paymentsSettings.STRIPE_API_KEY, {
  apiVersion: '2023-10-16',
});
