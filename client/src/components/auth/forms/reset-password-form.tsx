'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type z } from 'zod';

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
import { useToast } from '@/components/ui/use-toast';
import { resetPassword } from '@/hooks/auth/reset-password';
import { signUpSchema } from '@/schemas/auth/sign-up';

import { useAuthFormsContext } from '../auth-forms-provider';

const resetPasswordSchema = signUpSchema.pick({ email: true });

type ResetPassword = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const { setCurrentForm } = useAuthFormsContext();
  const { toast } = useToast();

  const form = useForm<ResetPassword>({
    defaultValues: {},
    mode: 'all',
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetPassword> = async (data) => {
    try {
      await resetPassword(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          description: 'There was a problem with your request',
          title: 'Uh oh! Something went wrong.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="flex min-h-fit flex-col gap-6">
      {form.formState.isSubmitSuccessful ? (
        <>
          <h1 className="text-center text-2xl font-bold">Check your email</h1>

          <p className="text-center">
            Please check the email address {form.getValues().email} for
            instructions to reset your password.
          </p>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Resend email</>
            )}
          </Button>
        </>
      ) : (
        <Form {...form}>
          <h1 className="text-center text-2xl font-bold">
            Reset your password
          </h1>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
            ></FormField>

            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>Continue</>
              )}
            </Button>
          </form>
        </Form>
      )}
      <div className="text-center text-sm">
        <p
          className="hover:cursor-pointer hover:underline"
          onClick={() => setCurrentForm('signIn')}
        >
          Back to Sign in
        </p>
      </div>
    </div>
  );
}
