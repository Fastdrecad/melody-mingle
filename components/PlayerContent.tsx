"use client";

import Slider from "@/components/Slider";
import useAuthModal from "@/hooks/useAuthModal";
import useDebounce from "@/hooks/useDebounce";
import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import {
  HiOutlineSpeakerWave,
  HiOutlineSpeakerXMark,
  HiSpeakerWave,
  HiSpeakerXMark
} from "react-icons/hi2";
import { IoMdShuffle } from "react-icons/io";
import { TbRepeat, TbRepeatOff, TbRepeatOnce } from "react-icons/tb";
import useSound from "use-sound";
import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import ProgressSlider from "./ProgressSlider";
import Tooltip from "./Tooltip";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const RepeatIcon = ({ mode }: { mode: "off" | "one" | "all" }) => {
  switch (mode) {
    case "off":
      return <TbRepeatOff size={20} className="text-neutral-400" />;
    case "one":
      return <TbRepeatOnce size={20} className="text-green-500" />;
    case "all":
      return <TbRepeat size={20} className="text-green-500" />;
    default:
      return null;
  }
};

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [tempPosition, setTempPosition] = useState<number | null>(null);
  const debouncedPosition = useDebounce(tempPosition, 150);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useUser();
  const authModal = useAuthModal();

  const Icon = player.isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon =
    player.volume === 0
      ? isVolumeHovered
        ? HiSpeakerXMark
        : HiOutlineSpeakerXMark
      : isVolumeHovered
      ? HiSpeakerWave
      : HiOutlineSpeakerWave;

  const [play, { sound }] = useSound(songUrl, {
    volume: player.volume,
    onplay: () => player.setIsPlaying(true),
    onend: () => {
      if (player.repeatMode === "one") {
        play();
      } else {
        const isLastSong = player.isShuffling
          ? !player.shuffleQueue[
              player.shuffleQueue.findIndex((id) => id === player.activeId) + 1
            ]
          : !player.ids[
              player.ids.findIndex((id) => id === player.activeId) + 1
            ];

        if (isLastSong && player.repeatMode !== "all") {
          player.setIsPlaying(false);
        } else {
          onPlayNext();
        }
      }
    },
    onpause: () => player.setIsPlaying(false),
    format: ["mp3"]
  });

  useEffect(() => {
    return () => {
      sound?.stop();
    };
  }, [sound]);

  useEffect(() => {
    if (!sound) return;

    if (songUrl) {
      if (sound.playing()) {
        sound.stop();
      }
      setCurrentTime(0);
    }
  }, [sound, songUrl]);

  useEffect(() => {
    if (!sound) return;

    if (player.isPlaying) {
      sound.play();
    } else {
      sound.pause();
    }
  }, [sound, player.isPlaying]);

  const debouncedSeek = useMemo(
    () =>
      debounce((value: number) => {
        if (!sound) return;
        sound.seek(value);
      }, 100),
    [sound]
  );

  useEffect(() => {
    return () => {
      debouncedSeek.cancel();
    };
  }, [debouncedSeek]);

  const fadeAudioTo = useCallback(
    (time: number) => {
      if (!sound) return;

      const currentVolume = player.volume;
      let currentStep = currentVolume;

      // Fade out
      const fadeOut = () => {
        currentStep = Math.max(0, currentStep - 0.1);
        sound.volume(currentStep);

        if (currentStep > 0) {
          requestAnimationFrame(fadeOut);
        } else {
          // When audio is muted, change position and start fade in
          sound.seek(time);
          setCurrentTime(time);
          requestAnimationFrame(fadeIn);
        }
      };

      // Fade in
      const fadeIn = () => {
        currentStep = Math.min(currentVolume, currentStep + 0.1);
        sound.volume(currentStep);

        if (currentStep < currentVolume) {
          requestAnimationFrame(fadeIn);
        }
      };

      requestAnimationFrame(fadeOut);
    },
    [sound, player.volume]
  );

  const handleSeek = (value: number) => {
    if (Math.abs(value - currentTime) > 1) {
      // Apply fade only for larger position changes
      fadeAudioTo(value);
    } else {
      // For small changes, use existing logic
      setCurrentTime(value);
      debouncedSeek(value);
    }
  };

  useEffect(() => {
    if (debouncedPosition !== null) {
      sound?.seek(debouncedPosition);
      setCurrentTime(debouncedPosition);
      setTempPosition(null);
    }
  }, [debouncedPosition, sound]);

  useEffect(() => {
    if (!sound) return;

    const durationCheck = setInterval(() => {
      const duration = sound.duration();

      if (duration && duration !== Infinity && duration !== 0) {
        setDuration(duration);
        clearInterval(durationCheck);
      }
    }, 100);

    return () => clearInterval(durationCheck);
  }, [sound]);

  useEffect(() => {
    if (!sound || !duration) return;

    const interval = setInterval(() => {
      const current = sound.seek();

      if (typeof current === "number" && !isNaN(current)) {
        setCurrentTime(current);

        if (player.repeatMode === "one" && duration - current <= 0.5) {
          sound.seek(0);
          setCurrentTime(0);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [sound, duration, player.repeatMode]);

  const handlePlay = () => {
    player.togglePlay();
  };

  const toggleMute = () => {
    player.toggleMute();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    let nextSong: string | undefined;

    if (player.isShuffling) {
      const currentIndex = player.shuffleQueue.findIndex(
        (id) => id === player.activeId
      );
      nextSong = player.shuffleQueue[currentIndex + 1];

      if (!nextSong) {
        if (player.repeatMode === "all") {
          nextSong = player.shuffleQueue[0];
        } else {
          return;
        }
      }
    } else {
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      nextSong = player.ids[currentIndex + 1];

      if (!nextSong) {
        if (player.repeatMode === "all") {
          nextSong = player.ids[0];
        } else {
          return;
        }
      }
    }

    if (nextSong) {
      player.setId(nextSong);
    }
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;

    if (currentTime > 3) {
      sound?.seek(0);
      setCurrentTime(0);
      return;
    }

    let previousSong: string | undefined;

    if (player.isShuffling) {
      const currentHistoryIndex = player.playHistory.indexOf(
        player.activeId || ""
      );
      previousSong = player.playHistory[currentHistoryIndex - 1];
    } else {
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      previousSong = player.ids[currentIndex - 1];
    }

    if (!previousSong) return;

    player.setId(previousSong);
  };

  const handleLike = () => {
    if (!user) {
      return authModal.onOpen();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="hidden h-full md:flex flex-col justify-center items-center w-full max-w-[722px] gap-y-2">
        <div className="flex justify-center items-center w-full max-w-[722px] gap-x-6">
          <Tooltip text={`Shuffle ${player.isShuffling ? "On" : "Off"}`}>
            <IoMdShuffle
              size={20}
              className={`cursor-pointer ${
                player.isShuffling ? "text-green-500" : "text-neutral-400"
              }`}
              onClick={() => player.toggleShuffle()}
            />
          </Tooltip>

          <Tooltip text="Previous">
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={30}
              className="text-neutral-400 cursor-pointer hover:text-white transition"
            />
          </Tooltip>

          <Tooltip text={player.isPlaying ? "Pause" : "Play"}>
            <div
              onClick={handlePlay}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
            >
              <Icon size={30} className="text-black" />
            </div>
          </Tooltip>

          <Tooltip text="Next">
            <AiFillStepForward
              onClick={onPlayNext}
              size={30}
              className="text-neutral-400 cursor-pointer hover:text-white transition"
            />
          </Tooltip>

          <Tooltip text={`Repeat ${player.repeatMode}`}>
            <div
              onClick={() => {
                player.setRepeatMode();
              }}
              className="cursor-pointer"
            >
              <RepeatIcon mode={player.repeatMode} />
            </div>
          </Tooltip>
        </div>

        <div className="w-full flex items-center gap-x-2">
          <span className="text-xs text-neutral-400 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <ProgressSlider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            className="cursor-pointer"
          />
          <span className="text-xs text-neutral-400 w-12">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div
          className="flex items-center gap-x-2 w-[120px]"
          onMouseEnter={() => setIsVolumeHovered(true)}
          onMouseLeave={() => setIsVolumeHovered(false)}
        >
          <Tooltip text={player.volume === 0 ? "Unmute" : "Mute"}>
            <VolumeIcon
              onClick={toggleMute}
              className={`cursor-pointer transition-colors ${
                isVolumeHovered ? "text-white" : "text-neutral-400"
              }`}
              size={20}
            />
          </Tooltip>
          <Slider
            value={player.volume}
            onChange={(value) => player.setVolume(value)}
            showThumb={isVolumeHovered}
          />
        </div>
      </div>

      <audio ref={audioRef} src={songUrl} onEnded={onPlayNext} />
    </div>
  );
};

export default PlayerContent;
