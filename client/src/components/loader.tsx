import { Icons } from './ui/icons';

export function Loader() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Icons.Spinner className="animate-spin" />
    </div>
  );
}
