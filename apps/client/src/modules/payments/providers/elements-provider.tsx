'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { useTheme } from 'next-themes';

import { env } from '@/env';

interface PaymentsProviderProps {
  children: React.ReactNode;
  options?: StripeElementsOptions;
}

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function ElementsProvider({
  children,
  options = {},
}: PaymentsProviderProps) {
  const { theme } = useTheme();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        ...options,
        appearance: {
          theme: theme === 'light' ? 'stripe' : 'night',
          variables: {
            fontFamily: 'Inter',
          },
        },
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css2?family=Inter',
            family: 'Inter',
          },
        ],
      }}
    >
      {children}
    </Elements>
  );
}
