import './emoji-picker.css';

import Picker from '@emoji-mart/react';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface Emoji {
  native: string;
  shortcodes: string;
  unified: string;
  aliases: string[];
  emoticons: string[];
}

export interface EmojiPickerProps {
  trigger: React.ReactNode;
  onSelect?: (emoji: Emoji) => void;
}

export function EmojiPicker({ trigger, onSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className="m-0 w-max p-0">
        <Picker
          data={async () => {
            const response = await fetch(
              'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
            );
            return response.json();
          }}
          onEmojiSelect={(emoji: Emoji) => {
            if (onSelect) onSelect(emoji);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
