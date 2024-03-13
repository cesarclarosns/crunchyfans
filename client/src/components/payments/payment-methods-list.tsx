'use client';

import {} from '@stripe/react-stripe-js';

import { useGetPaymentMethods } from '@/hooks/payments/use-get-payment-methods';

import { Card, CardContent } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Icons } from '../ui/icons';

export function PaymentMethodsList() {
  const { data: paymentMethods } = useGetPaymentMethods();

  console.log('cards', paymentMethods);

  return (
    <div className="flex flex-col p-4">
      {!!paymentMethods &&
        paymentMethods.map((paymentMethod) => {
          return (
            <Card
              key={paymentMethod.id}
              className="border-2 hover:cursor-pointer hover:bg-secondary hover:backdrop-blur-md"
            >
              <CardContent className="p-0">
                <div className="flex justify-between p-2">
                  <div>
                    <div className="uppercase">{paymentMethod.card?.brand}</div>
                    <div>···· ···· ···· {paymentMethod.card?.last4}</div>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Icons.MoreVerticalIcon className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        onCloseAutoFocus={(ev) => ev.preventDefault()}
                      >
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
