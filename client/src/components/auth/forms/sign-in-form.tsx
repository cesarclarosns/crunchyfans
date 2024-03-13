'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
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
import { useSignInMutation } from '@/hooks/auth/use-sign-in-mutation';
import { type SignIn, signInSchema } from '@/schemas/auth/sign-in';

import { useAuthFormsContext } from '../auth-forms-provider';
import { SocialSignIn } from './social-sign-in';

export function SignInForm() {
  const { setCurrentForm } = useAuthFormsContext();
  const { mutateAsync } = useSignInMutation();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignIn>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignIn> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as Record<
          string,
          Record<string, string>
        >;

        if (data?.errors?.email)
          form.setError('email', {
            message: data?.errors?.email,
          });

        if (data?.errors?.password)
          form.setError('password', {
            message: data?.errors.password,
          });
      }
    }
  };

  return (
    <div className="flex min-h-fit flex-col gap-6">
      <Form {...form}>
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      placeholder="Password"
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
              <>Sign in with Email</>
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SocialSignIn />
      </div>

      <div className="text-center text-sm">
        <p
          className="hover:cursor-pointer hover:underline"
          onClick={() => setCurrentForm('resetPassword')}
        >
          Forgot password?
        </p>

        <p>
          Don't have an account?{' '}
          <span
            onClick={() => setCurrentForm('signUp')}
            className="hover:cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
