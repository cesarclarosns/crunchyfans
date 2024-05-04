'use client';

import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  type StripeAddressElementChangeEvent,
  type StripePaymentElementChangeEvent,
} from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';

import { useCreateSetupIntent } from '@/modules/payments/hooks/use-create-setup-intent';
import { Button } from '@/modules/ui/components/button';
import { Icons } from '@/modules/ui/components/icons';
import { useToast } from '@/modules/ui/components/use-toast';

export default function AddCardForm() {
  const router = useRouter();
  const { toast } = useToast();

  const stripe = useStripe();
  const elements = useElements();

  const createSetupIntent = useCreateSetupIntent();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [isPaymentElementComplete, setIsPaymentElementComplete] =
    useState(false);
  const [isAddressElementComplete, setIsAddressElementComplete] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentElement = elements?.getElement('payment');
  const addressElement = elements?.getElement('address');

  useEffect(() => {
    createSetupIntent
      .mutateAsync()
      .then(({ clientSecret }) => setClientSecret(clientSecret))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const handleChange = (ev: StripeAddressElementChangeEvent) => {
      setIsAddressElementComplete(ev.complete);
    };

    addressElement?.on('change', handleChange);

    return () => {
      addressElement?.off('change', handleChange);
    };
  }, [addressElement]);

  useEffect(() => {
    const handleChange = (ev: StripePaymentElementChangeEvent) => {
      setIsPaymentElementComplete(ev.complete);
    };

    paymentElement?.on('change', handleChange);

    return () => {
      paymentElement?.off('change', handleChange);
    };
  }, [paymentElement]);

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    try {
      ev.preventDefault();
      setIsSubmitting(true);

      if (!stripe || !elements) return;
      if (!clientSecret) return;

      const submitResult = await elements.submit();
      if (submitResult.error) {
        toast({
          description: submitResult.error.message,
          title: 'There was an error while adding your card',
          variant: 'destructive',
        });
        return;
      }

      const confirmSetupResult = await stripe.confirmSetup({
        clientSecret,
        elements,
        redirect: 'if_required',
      });
      if (confirmSetupResult.error) {
        toast({
          description: confirmSetupResult.error.message,
          title: 'There was an error while adding your card',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Your payment card was added!' });

      paymentElement?.clear();
      addressElement?.clear();

      router.push('/my/payments/cards');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-fit flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <form
        className="flex min-h-fit flex-col gap-5 px-4 py-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5">
          <p className="font-semibold">Card details</p>
          <PaymentElement />
        </div>

        <div className="mb-5 flex flex-col gap-5">
          <p className="font-semibold">Billing details</p>
          <AddressElement options={{ mode: 'billing' }} />
        </div>

        <Button
          disabled={
            !isAddressElementComplete ||
            !isPaymentElementComplete ||
            !!!clientSecret ||
            isSubmitting
          }
        >
          {isSubmitting ? (
            <>
              <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </form>
    </div>
  );
}
