import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { UserFolloweesList } from './user-followees-list';
import { UserFollowersList } from './user-followers-list';

interface UsersFollowersDialogProps {
  trigger: React.ReactNode;
  userId: string;
}

export function UsersFollowersDialog({
  trigger,
  userId,
}: UsersFollowersDialogProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger>{trigger}</DialogTrigger>
        <DialogContent>
          <Tabs defaultValue="followers">
            <TabsList>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="followees">Followees</TabsTrigger>
            </TabsList>
            <TabsContent value="followers">
              <UserFollowersList userId={userId} />
            </TabsContent>
            <TabsContent value="followees">
              <UserFolloweesList userId={userId} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
