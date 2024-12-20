import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { create } from "zustand";
import { useUser } from "./useUser";

interface LikedSongsStore {
  likedSongIds: string[];
  isLoading: boolean;
  addLikedSong: (id: string) => void;
  removeLikedSong: (id: string) => void;
  setLikedSongs: (ids: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

const useLikedSongs = create<LikedSongsStore>((set) => ({
  likedSongIds: [],
  isLoading: true,
  addLikedSong: (id: string) =>
    set((state) => ({
      likedSongIds: [...state.likedSongIds, id]
    })),
  removeLikedSong: (id: string) =>
    set((state) => ({
      likedSongIds: state.likedSongIds.filter((songId) => songId !== id)
    })),
  setLikedSongs: (ids: string[]) => set({ likedSongIds: ids }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  reset: () => set({ likedSongIds: [], isLoading: false })
}));

export const useInitializeLikedSongs = () => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const setLikedSongs = useLikedSongs((state) => state.setLikedSongs);
  const setIsLoading = useLikedSongs((state) => state.setIsLoading);
  const reset = useLikedSongs((state) => state.reset);

  useEffect(() => {
    if (!user?.id) {
      reset();
      return;
    }

    const fetchLikedSongs = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabaseClient
          .from("liked_songs")
          .select("song_id")
          .eq("user_id", user.id);

        const ids = data?.map((item) => item.song_id) || [];
        setLikedSongs(ids);
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedSongs();
  }, [user?.id, supabaseClient, setLikedSongs, setIsLoading, reset]);
};

export default useLikedSongs;
