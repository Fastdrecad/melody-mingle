import { createShuffleQueue, PlayerStore } from "@/hooks/usePlayer";
import { useCallback } from "react";

export const useQueueNavigation = (player: PlayerStore) => {
  const getNextSong = useCallback(() => {
    if (player.isShuffling) {
      const currentIndex = player.shuffleQueue.findIndex(
        (id) => id === player.activeId
      );
      // If the current song is the last in the shuffle queue, loop back to it
      const nextSong = player.shuffleQueue[currentIndex + 1];

      if (!nextSong) {
        if (player.repeatMode === "all") {
          const newQueue = createShuffleQueue(
            player.ids.filter((id) => id !== player.activeId),
            undefined,
            player.shuffleQueue
          );
          player.setShuffleQueue(newQueue);
          player.resetShuffleHistory();
          return newQueue[0];
        }
        return player.activeId; // Keep the current song
      }

      return nextSong;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    return player.ids[currentIndex + 1];
  }, [player]);

  const getPreviousSong = useCallback(() => {
    if (player.isShuffling) {
      const currentHistoryIndex = player.playHistory.indexOf(
        player.activeId || ""
      );
      const previousSong = player.playHistory[currentHistoryIndex - 1];
      return previousSong;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    return player.ids[currentIndex - 1];
  }, [player.isShuffling, player.playHistory, player.ids, player.activeId]);

  return { getNextSong, getPreviousSong };
};
