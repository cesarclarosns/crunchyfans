import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type z } from 'zod';

import { Button } from '@/modules/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/modules/ui/components/form';
import { Icons } from '@/modules/ui/components/icons';
import { Input } from '@/modules/ui/components/input';
import { useUpdateUserMutation } from '@/modules/users/hooks/use-update-user';
import { type User, userSchema } from '@/modules/users/schemas/user';

const userEmailFormSchema = userSchema.pick({
  email: true,
});

type UserEmailForm = z.infer<typeof userEmailFormSchema>;

export function EditUserEmailForm({ user }: { user: User }) {
  const updateUserMutation = useUpdateUserMutation(user?._id!);

  const form = useForm<UserEmailForm>({
    defaultValues: {
      email: user.email,
    },
    mode: 'all',
    resolver: zodResolver(userEmailFormSchema),
  });

  const onSubmit: SubmitHandler<UserEmailForm> = async (data) => {
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    spellCheck={false}
                  ></Input>
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
              <>Update email</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
