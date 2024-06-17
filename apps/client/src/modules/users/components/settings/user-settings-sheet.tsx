import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/modules/ui/components/sheet';

interface UserSettingsSheetProps {
  trigger: React.ReactNode;
}

export function UserSettingsSheet({ trigger }: UserSettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <p>Settings</p>
        </SheetHeader>
        <p>...</p>
        <SheetFooter>
          <p>Footer</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
