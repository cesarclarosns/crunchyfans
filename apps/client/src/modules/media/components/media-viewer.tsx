import Image from 'next/image';
import ReactPlayer from 'react-player';

import { type Media } from '@/modules/media/schemas/media';

export interface MediaViewerProps {
  media: Media;
}

export function MediaViewer({ media }: MediaViewerProps) {
  return (
    <>
      {media.mediaType === 'image' ? (
        <Image
          src={media.sources[0]?.fileUrl ?? ''}
          alt=""
          layout={'fill'}
          objectFit={'contain'}
        />
      ) : media.mediaType === 'video' ? (
        <ReactPlayer
          playing={false}
          controls={true}
          url={media.sources[0]?.fileUrl ?? ''}
          config={{}}
          style={{
            fontFamily: 'initial',
          }}
        />
      ) : null}
    </>
  );
}
