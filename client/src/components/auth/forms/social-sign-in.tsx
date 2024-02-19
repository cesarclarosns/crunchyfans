import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { env } from '@/env';

export function SocialSignIn() {
  return (
    <div className="flex min-h-fit flex-col">
      <Button
        onClick={() => {
          window.location.href = `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}/auth/google-oauth`;
        }}
        className="flex items-center justify-center"
      >
        <Icons.GoogleLogoIcon className="mr-2 h-4 w-4" />
        <p>Google</p>
      </Button>
    </div>
  );
}
