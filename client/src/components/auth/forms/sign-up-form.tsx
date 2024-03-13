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
import { useSignUpMutation } from '@/hooks/auth/use-sign-up-mutation';
import { type SignUp, signUpSchema } from '@/schemas/auth/sign-up';

import { useAuthFormsContext } from '../auth-forms-provider';

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentForm } = useAuthFormsContext();
  const { mutateAsync } = useSignUpMutation();

  const form = useForm<SignUp>({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      username: '',
    },
    mode: 'all',
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errors = err.response?.data?.errors;

        if (errors?.email)
          form.setError('email', {
            message: errors.email,
          });
        if (errors?.password)
          form.setError('password', {
            message: errors.password,
          });
      }
    }
  };

  return (
    <div className="flex min-h-fit flex-col gap-5">
      <Form {...form}>
        <h1 className="text-center text-2xl font-bold">Create an account</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          ></FormField>

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          ></FormField>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
              <>Continue</>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p>
          Already have an account?{' '}
          <span
            onClick={() => setCurrentForm('signIn')}
            className="hover:cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
