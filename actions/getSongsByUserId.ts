import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData?.session?.user?.id) {
    console.log(
      sessionError ? sessionError.message : 'No user ID found in session.'
    );
    return [];
  }

  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as any) || [];
};

export default getSongsByUserId;
