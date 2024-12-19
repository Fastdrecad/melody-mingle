type RepeatMode = "off" | "one" | "all";

interface QueueState {
  ids: string[];
  shuffleQueue: string[];
  playHistory: string[];
  originalQueue: string[];
}

interface PlayerState {
  activeId?: string;
  isPlaying: boolean;
  isShuffling: boolean;
  repeatMode: RepeatMode;
  volume: number;
  previousVolume: number;
}

interface PlayerStore extends QueueState, PlayerState {
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  setIsPlaying: (value: boolean) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setRepeatMode: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}
