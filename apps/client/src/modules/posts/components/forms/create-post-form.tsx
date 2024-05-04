'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { MediaUploadsCarousel } from '@/modules/media/components/media-uploads-carousel';
import { Button } from '@/modules/ui/components/button';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/modules/ui/components/form';
import { Icons } from '@/modules/ui/components/icons';
import { Textarea } from '@/modules/ui/components/textarea';
import { useToast } from '@/modules/ui/components/use-toast';
import { useUploadMedia } from '@/modules/media/hooks/use-upload-media';
import { useCreatePostMutation } from '@/modules/posts/hooks/use-create-post';
import { type CreatePost, createPostSchema } from '@/modules/posts/schemas/create-post';

export function CreatePostForm() {
  const createPostMutation = useCreatePostMutation();
  const uploadMedia = useUploadMedia({
    needsThumbnail: true,
    needsWatermark: true,
  });
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreatePost>({
    defaultValues: {
      content: '',
      media: [],
    },
    mode: 'all',
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit: SubmitHandler<CreatePost> = async (data) => {
    try {
      data.media = [
        ...data.media,
        ...uploadMedia.uploads.map((upload) => upload.media!._id),
      ];
      await createPostMutation.mutateAsync(data);

      uploadMedia.handleRemoveUploads();

      toast({ title: 'Post created!' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-fit flex-col gap-4"
      >
        <MediaUploadsCarousel {...uploadMedia} />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  spellCheck={false}
                  placeholder="Compose a post..."
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <input
            type="file"
            multiple
            onChange={uploadMedia.handleSelectFiles}
            className="hidden"
            ref={inputRef}
            accept={uploadMedia.accept}
          />
          <Icons.Image
            className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground"
            onClick={() => inputRef.current?.click()}
          />
          <EmojiPicker
            onSelect={(emoji) => {
              form.setValue(
                'content',
                form.getValues().content + emoji.native,
                { shouldDirty: true, shouldTouch: true, shouldValidate: true },
              );
            }}
            trigger={
              <Icons.SmileIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
            }
          />
        </div>

        <div className="flex justify-end">
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
              <>Post</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
