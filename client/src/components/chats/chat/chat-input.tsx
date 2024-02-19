import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import {
  type CreateChatMessage,
  createChatMessageSchema,
} from '@/common/schemas/chats/create-chat-message.schema';
import { MediaUploadsCarousel } from '@/components/media/media-uploads-carousel';
import { Button } from '@/components/ui/button';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { Icons } from '@/components/ui/icons';
import { Textarea } from '@/components/ui/textarea';
import { useCreateChatMessageMutation } from '@/hooks/chats/use-create-chat-message-mutation';
import { useUploadMedia } from '@/hooks/media';
import { socket } from '@/libs/socket';

import { useChatContext } from './chat-provider';

export interface ChatInputProps {}

export function ChatInput({}: ChatInputProps) {
  const { chat } = useChatContext();

  const uploadMedia = useUploadMedia();

  const createChatMessageMutation = useCreateChatMessageMutation();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateChatMessage>({
    defaultValues: {
      chatId: chat._id,
      content: '',
      media: [],
    },
    mode: 'all',
    resolver: zodResolver(createChatMessageSchema),
  });

  const onSubmit: SubmitHandler<CreateChatMessage> = async (data) => {
    try {
      console.log('onSubmut', data);
      await createChatMessageMutation.mutateAsync({
        ...data,
        media: [...uploadMedia.uploads.map((upload) => upload.media!._id)],
      });

      form.reset();
      uploadMedia.handleRemoveUploads();
    } catch (err) {
      console.error('onSubmit', err);
    }
  };

  const content = form.watch('content');

  const emitUserTypingEvRef = useRef(true);
  useEffect(() => {
    if (!emitUserTypingEvRef.current || !content) return;

    emitUserTypingEvRef.current = false;
    socket.emit('chats/user-typing', { chatId: chat._id }, (response) => {
      console.log('emit chats/user-typing', { response });
    });
    setTimeout(() => (emitUserTypingEvRef.current = true), 500);
  }, [content]);

  return (
    <div className="flex flex-col gap-2">
      <MediaUploadsCarousel {...uploadMedia} />
      <form className="flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-1">
          <Textarea
            className="max-h-[60px] min-h-[60px] resize-none"
            spellCheck={false}
            {...form.register('content')}
          ></Textarea>
        </div>
        <Button
          type="submit"
          variant={'link'}
          size={'icon'}
          disabled={
            form.formState.isSubmitting ||
            !(
              (!!uploadMedia.uploads.length &&
                uploadMedia.uploadsState.isSuccess) ||
              !!content.length
            )
          }
        >
          <Icons.SendHorizontalIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
        </Button>
      </form>
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
        {/* <Icons.StickerIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" /> */}
        <EmojiPicker
          trigger={
            <Icons.SmileIcon className="h-5 w-5 hover:cursor-pointer hover:text-muted-foreground" />
          }
          onSelect={(emoji) => {
            form.setValue('content', form.getValues().content + emoji.native);
          }}
        />
      </div>
    </div>
  );
}
