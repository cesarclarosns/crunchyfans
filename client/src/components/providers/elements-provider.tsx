import { Elements, LinkAuthenticationElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

import { env } from '@/env';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function ElementsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
        {children}
      {/* <Elements stripe={stripePromise} options={{}}>
        <LinkAuthenticationElement></LinkAuthenticationElement>
      </Elements> */}
    </>
  );
}
