import { zodResolver } from '@hookform/resolvers/zod';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import {
  type CreatePost,
  createPostSchema,
} from '@/common/schemas/posts/create-post';
import { MediaUploadsCarousel } from '@/components/media/media-uploads-carousel';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { GifPicker } from '@/components/ui/gif-picker';
import { Icons } from '@/components/ui/icons';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useUploadMedia } from '@/hooks/media';
import { useCreatePostMutation } from '@/hooks/posts/use-create-post-mutation';

export interface CreatePostFormProps {
  onError?: (err: unknown) => void;
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess, onError }: CreatePostFormProps) {
  const createPostMutation = useCreatePostMutation();
  const {
    uploads,
    accept,
    handleSelectFiles,
    handleRemoveUpload,
    handleRemoveUploads,
  } = useUploadMedia();
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
        ...uploads.map((upload) => upload.media!._id),
      ];
      const post = await createPostMutation.mutateAsync(data);
      console.log('onSubmit', post);

      handleRemoveUploads();

      toast({ title: 'Post created' });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);

      if (onError) onError(err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <MediaUploadsCarousel
          uploads={uploads}
          handleRemoveUpload={handleRemoveUpload}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="..." />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <input
            type="file"
            multiple
            onChange={handleSelectFiles}
            className="hidden"
            ref={inputRef}
            accept={accept}
          />
          <Icons.Image
            className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground"
            onClick={() => inputRef.current?.click()}
          />
          <Icons.StickerIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
          <Icons.SmileIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
          <GifPicker />
        </div>

        <div className="mt-5 flex justify-end gap-2">
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
