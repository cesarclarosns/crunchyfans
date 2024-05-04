import { create } from 'zustand';

interface ChatsState {
  unreadChats: number;
  setUnreadChats: (unreadChats: number) => void;
}

export const useChatsStore = create<ChatsState>()((set) => ({
  setUnreadChats: (unreadChats) => set(() => ({ unreadChats })),
  unreadChats: 0,
}));
