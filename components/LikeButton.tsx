'use client';

import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import toast from 'react-hot-toast';

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId);

      if (!error && data.length > 0) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    const newState = !isLiked;
    setIsLiked(newState);

    const action = newState
      ? supabaseClient
          .from('liked_songs')
          .insert({ song_id: songId, user_id: user.id })
      : supabaseClient
          .from('liked_songs')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songId);

    const { error } = await action;

    if (error) {
      toast.error(error.message);
      setIsLiked(!newState);
    } else {
      toast.success(newState ? 'Liked!' : 'Unliked!');
    }

    router.refresh();
  };

  return (
    <button className='hover:opacity-75 transition' onClick={handleLike}>
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  );
};

export default LikeButton;
