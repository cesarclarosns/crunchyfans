import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Icons } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';
import { type UseUploadMedia } from '@/hooks/media/use-upload-media';
import { cn } from '@/libs/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export type MediaUploadsCarouselProps = UseUploadMedia;

export function MediaUploadsCarousel({
  uploads,
  handleRemoveUpload,
}: MediaUploadsCarouselProps) {
  return (
    <Carousel>
      <CarouselContent>
        {uploads.map((upload) => (
          <CarouselItem key={upload.file.name} className="basis-auto">
            <div
              className={cn(
                'relative flex aspect-square w-32 max-w-32 rounded-lg border-[1px]',
              )}
            >
              <Image
                alt={upload.file.name}
                src={upload.objectUrl}
                fill={true}
                className={cn(
                  'rounded-[inherit] opacity-75',
                  upload.status !== 'success' ? 'blur-[1px]' : '',
                )}
                objectFit={'cover'}
              />

              <Popover>
                <PopoverTrigger className="relative">
                  <Icons.InfoIcon className="absolute left-2 top-2 z-10 h-4 w-4 hover:cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-fit max-w-[75vw] truncate px-2 py-1 text-xs">
                  <span className="truncate">{upload.file.name}</span>
                </PopoverContent>
              </Popover>

              <Icons.XIcon
                className="absolute right-2 top-2 z-10 h-4 w-4 hover:cursor-pointer"
                onClick={() => handleRemoveUpload(upload)}
              />

              {upload.status !== 'success' && (
                <Progress
                  value={upload.progress}
                  className="absolute bottom-0 left-0 right-0 z-10 m-2 h-2 w-[-webkit-fill-available]"
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-1/2" />
      <CarouselNext className="right-2 top-1/2" />
    </Carousel>
  );
}
