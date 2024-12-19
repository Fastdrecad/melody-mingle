"use client";

import usePlayer from "@/hooks/usePlayer";
import { FaPause, FaPlay } from "react-icons/fa";

interface PlayButtonProps {
  songId: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ songId }) => {
  const player = usePlayer();
  const isCurrentSong = player.activeId === songId;

  const Icon = isCurrentSong && player.isPlaying ? FaPause : FaPlay;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isCurrentSong) {
      player.togglePlay();
    } else {
      event.currentTarget.parentElement?.parentElement?.click();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        transition 
        opacity-0 
        rounded-full 
        flex 
        items-center 
        bg-green-500 
        p-4 
        drop-shadow-md 
        translate
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
        hover:scale-110
      "
    >
      <Icon className="text-black" size={20} />
    </button>
  );
};

export default PlayButton;
