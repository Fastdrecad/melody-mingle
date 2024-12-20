"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useLikedSongs from "@/hooks/useLikedSongs";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const authModal = useAuthModal();
  const { user } = useUser();
  const { likedSongIds, addLikedSong, removeLikedSong } = useLikedSongs();

  const isLiked = user ? likedSongIds.includes(songId) : false;

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        addLikedSong(songId);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id, addLikedSong]);

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    try {
      if (isLiked) {
        const { error } = await supabaseClient
          .from("liked_songs")
          .delete()
          .eq("user_id", user.id)
          .eq("song_id", songId);

        if (error) {
          throw error;
        }
        removeLikedSong(songId);
      } else {
        const { error } = await supabaseClient
          .from("liked_songs")
          .insert({ song_id: songId, user_id: user.id });

        if (error) {
          throw error;
        }
        addLikedSong(songId);
        toast.success("Liked!");
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button className="hover:opacity-75 transition" onClick={handleLike}>
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
