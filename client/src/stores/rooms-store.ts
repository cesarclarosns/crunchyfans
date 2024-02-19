import { create } from 'zustand';

interface RoomsState {
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;
}

export const useRoomsStore = create<RoomsState>()((set) => ({
  roomId: null,
  setRoomId: (roomId) => set(() => ({ roomId })),
}));
