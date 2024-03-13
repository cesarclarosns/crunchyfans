import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateUserMutation } from '@/hooks/users/use-update-user-mutation';
import {
  type UpdateProfile,
  updateProfileSchema,
} from '@/schemas/users/update-profile';
import { type User } from '@/schemas/users/user';

import { UserAvatar } from '../user-avatar';

export function EditUserProfileForm({ user }: { user: User }) {
  const updateUserMutation = useUpdateUserMutation();

  const form = useForm<UpdateProfile>({
    defaultValues: {
      bio: user.bio,
      displayName: user.displayName,
    },
    mode: 'all',
    resolver: zodResolver(updateProfileSchema),
  });

  const onSubmit: SubmitHandler<UpdateProfile> = async (data) => {
    try {
      await updateUserMutation.mutateAsync(data);
    } catch (err) {
      console.error('onSubmit', err);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="relative m-0 h-fit w-fit p-0">
            <UserAvatar user={user} className="h-16 w-16" />
            <Icons.CameraIcon
              className="absolute left-1 top-1/2 h-5 w-5
 -translate-y-1/2 transform hover:cursor-pointer hover:text-muted-foreground"
            />
            <Icons.XIcon
              className="absolute right-1 top-1/2 h-5 w-5 
 -translate-y-1/2 transform hover:cursor-pointer hover:text-muted-foreground"
            />
          </div>

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Display name"
                    spellCheck={false}
                  ></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Bio"
                    spellCheck={false}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Update profile</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
