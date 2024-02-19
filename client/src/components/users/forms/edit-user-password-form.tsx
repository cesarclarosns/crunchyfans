import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';

const editUserPasswordSchema = z.object({});

type EditUserPassword = z.infer<typeof editUserPasswordSchema>;

export function EditUserPasswordForm() {
  const form = useForm<EditUserPassword>({
    defaultValues: {},
    mode: 'all',
    resolver: zodResolver(editUserPasswordSchema),
  });

  const onSubmit: SubmitHandler<EditUserPassword> = async (data) => {
    try {
    } catch (err) {
      console.error('onSubmit', err);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        ></form>
      </Form>
    </div>
  );
}
