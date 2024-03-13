import { type PaymentMethod } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type User } from '@/schemas/users/user';

import { usersKeys } from '../users/users-keys';

export function useGetPaymentMethods() {
  return useQuery({
    queryFn: async (): Promise<PaymentMethod[]> => {
      const response = await api.get('payments/list-payment-methods');
      return response.data;
    },
    queryKey: [],
  });
}
