import ReactPlayer from 'react-player';

type VideoPlayerProps = React.ComponentProps<typeof ReactPlayer>;

export function VideoPlayer({ ...props }: VideoPlayerProps) {
  return (
    <div>
      <ReactPlayer {...props} controls={false} />
    </div>
  );
}

export function Controls() {}
