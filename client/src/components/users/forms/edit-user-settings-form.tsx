import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

export const editUserSettingsSchema = z.object({});

export type EditUserSettingsSchema = z.infer<typeof editUserSettingsSchema>;

export function EditUserSettingsForm() {
  const form = useForm<EditUserSettingsSchema>({
    defaultValues: {},
    mode: 'all',
    resolver: zodResolver(editUserSettingsSchema),
  });

  const onSubmit: SubmitHandler<EditUserSettingsSchema> = async (data) => {
    try {
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p>Edit settings</p>
      <Form {...form}>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        ></form>
      </Form>
    </div>
  );
}
