import { Icons } from '@/components/ui/icons';

export default function PaymentsListPage() {
  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex h-14 min-h-fit items-center gap-2 border-b-2 px-4 py-2">
        <div>
          <Icons.ArrowLeftIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <p className="text-xl font-bold">Your payments</p>
        </div>
      </div>
    </div>
  );
}
