import { cn } from '@/modules/ui/libs/utils';

type ChatFallbackProps = React.ComponentProps<'div'>;

export function ChatFallback({ className, ...props }: ChatFallbackProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-1 flex-col items-center justify-center',
        className,
      )}
    >
      <p className="text-3xl font-semibold">Select a conversation</p>
    </div>
  );
}
