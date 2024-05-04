'use client';

import AddCardForm from '@/modules/payments/components/add-card-form';
import { Button } from '@/modules/ui/components/button';
import { Icons } from '@/modules/ui/components/icons';
import { useCreateAccountOnboardingLink } from '@/modules/payments/hooks/use-create-account-onboarding-link';
import { useCreateAccountUpdateLink } from '@/modules/payments/hooks/use-create-account-update-link';
import { ElementsProvider } from '@/modules/payments/providers/elements-provider';

export default function BankAccountsPage() {
  const createAccountOnboardingLink = useCreateAccountOnboardingLink();
  const createAccountUpdateLink = useCreateAccountUpdateLink();

  const handleAccountOnboarding = async () => {
    try {
      const { url } = await createAccountOnboardingLink.mutateAsync();
      window.location.href = url;
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccountUpdate = async () => {
    try {
      const { url } = await createAccountUpdateLink.mutateAsync();
      window.location.href = url;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="sticky top-0 z-50 flex h-14 min-h-fit items-center gap-2 border-b-2 px-4 py-2 backdrop-blur-md">
        <div>
          <Icons.ArrowLeftIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <p className="text-xl font-bold">Bank account</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        <Button onClick={handleAccountOnboarding}>Account onboarding</Button>
        <Button onClick={handleAccountUpdate}>Account update</Button>
      </div>
    </div>
  );
}
