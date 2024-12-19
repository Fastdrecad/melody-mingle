import { create } from "zustand";

export interface PlayerStore {
  ids: string[];
  activeId?: string;
  isPlaying: boolean;
  isShuffling: boolean;
  repeatMode: "off" | "one" | "all";
  volume: number;
  previousVolume: number;
  shuffleQueue: string[];
  playHistory: string[];
  originalQueue: string[];

  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  setIsPlaying: (value: boolean) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setRepeatMode: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setShuffleQueue: (queue: string[]) => void;
  resetShuffleHistory: () => void;
}

export const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const createShuffleQueue = (
  ids: string[],
  activeId?: string,
  currentQueue?: string[]
) => {
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  if (activeId) {
    const index = shuffled.indexOf(activeId);
    if (index !== -1) {
      shuffled.splice(index, 1);
      shuffled.unshift(activeId);
    }
  }
  return shuffled;
};

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  isShuffling: false,
  repeatMode: "off",
  volume: 1,
  previousVolume: 1,
  shuffleQueue: [],
  playHistory: [],
  originalQueue: [],

  setId: (id: string) =>
    set((state) => {
      if (state.activeId === id) {
        return { ...state, isPlaying: !state.isPlaying };
      }

      // Dodajemo u istoriju samo ako je shuffle aktivan
      if (state.isShuffling) {
        return {
          ...state,
          activeId: id,
          isPlaying: true,
          playHistory: [...state.playHistory, id]
        };
      }

      return {
        ...state,
        activeId: id,
        isPlaying: true
      };
    }),

  setIds: (ids: string[]) =>
    set((state) => ({
      ...state,
      ids
    })),

  reset: () =>
    set({
      ids: [],
      activeId: undefined,
      isPlaying: false,
      volume: 1,
      previousVolume: 1,
      isShuffling: false,
      repeatMode: "off"
    }),

  setIsPlaying: (value: boolean) => set({ isPlaying: value }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  toggleShuffle: () =>
    set((state) => {
      const newIsShuffling = !state.isShuffling;

      if (newIsShuffling) {
        // Kreiramo JEDNU shuffle listu
        const shuffledIds = shuffleArray([...state.ids]);

        // Ako postoji aktivna pesma, stavljamo je na početak
        if (state.activeId) {
          const currentIndex = shuffledIds.indexOf(state.activeId);
          if (currentIndex !== -1) {
            shuffledIds.splice(currentIndex, 1);
            shuffledIds.unshift(state.activeId);
          }
        }

        return {
          ...state,
          isShuffling: true,
          originalQueue: [...state.ids],
          shuffleQueue: shuffledIds,
          playHistory: state.activeId ? [state.activeId] : []
        };
      }

      return {
        ...state,
        isShuffling: false,
        shuffleQueue: [],
        ids: state.originalQueue.length ? state.originalQueue : state.ids,
        playHistory: []
      };
    }),

  setRepeatMode: () =>
    set((state) => {
      const modes: ("off" | "one" | "all")[] = ["off", "one", "all"];
      const currentIndex = modes.indexOf(state.repeatMode);
      const newMode = modes[(currentIndex + 1) % modes.length];

      return {
        ...state,
        repeatMode: newMode
      };
    }),

  setVolume: (volume: number) =>
    set((state) => ({
      ...state,
      volume,
      previousVolume: volume > 0 ? volume : state.previousVolume
    })),

  toggleMute: () =>
    set((state) => {
      if (state.volume === 0) {
        return { ...state, volume: state.previousVolume };
      }
      return { ...state, volume: 0 };
    }),

  setShuffleQueue: (queue: string[]) =>
    set((state) => ({ ...state, shuffleQueue: queue })),

  resetShuffleHistory: () => set((state) => ({ ...state, playHistory: [] }))
}));

export default usePlayer;
