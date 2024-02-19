import { create } from 'zustand';

export interface ChatsState {
  chatId: string | null;
  setChatId: (chatId: string | null) => void;
}

export const useChatsStore = create<ChatsState>()((set) => ({
  chatId: null,
  setChatId: (chatId) => set(() => ({ chatId })),
}));
