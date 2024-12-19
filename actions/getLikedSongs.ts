import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Early return if no session or user ID
  if (!session?.user?.id) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("liked_songs")
      .select("*, songs(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getLikedSongs] Error:", error.message);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((item) => ({
      ...item.songs
    })) as Song[];
  } catch (error) {
    console.error("[getLikedSongs] Unexpected error:", error);
    return [];
  }
};

export default getLikedSongs;
