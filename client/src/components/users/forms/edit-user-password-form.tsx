import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUpdatePasswordMutation } from '@/hooks/auth/use-update-password-mutation';
import { signUpSchema } from '@/schemas/auth/sign-up';

const userPasswordFormSchema = signUpSchema.pick({
  password: true,
});

type UserPasswordForm = z.infer<typeof userPasswordFormSchema>;

export function EditUserPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const updatePasswordMutation = useUpdatePasswordMutation();

  const form = useForm<UserPasswordForm>({
    defaultValues: {},
    mode: 'all',
    resolver: zodResolver(userPasswordFormSchema),
  });

  const onSubmit: SubmitHandler<UserPasswordForm> = async (data) => {
    try {
      await updatePasswordMutation.mutateAsync(data);
      toast({
        title: 'Your password has been updated!',
      });
    } catch (err) {
      console.error('onSubmit', err);
      toast({
        description: 'There was a problem with your request',
        title: 'Uh oh! Something went wrong.',
        variant: 'destructive',
      });
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      placeholder="New password"
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                    ></Input>
                    <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
                      {showPassword ? (
                        <Icons.EyeOpenIcon
                          className="h-5 w-5"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Icons.EyeClosedIcon
                          className="h-5 w-5"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className=" whitespace-pre-wrap" />
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
              <>Update password</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
