import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type DialogTrigger,
} from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';

import { CreatePostForm } from './create-post-form';

export interface CreatePostFormDialogProps {
  trigger?: React.ReactElement<typeof DialogTrigger>;
  header?: React.ReactElement<typeof DialogHeader>;
}

export function CreatePostFormDialog({
  trigger,
  header,
}: CreatePostFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        trigger
      ) : (
        <Button size={'icon'} variant={'ghost'} className="h-fit w-fit">
          <Icons.PlusSquareIcon className="stroke-2" />
        </Button>
      )}
      <DialogContent
        className="max-h-[75vh] overflow-y-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {header ? (
          header
        ) : (
          <DialogHeader className="pb-5">
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
        )}

        <CreatePostForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
