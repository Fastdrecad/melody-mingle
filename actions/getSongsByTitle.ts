import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (
  title?: string,
  author?: string
): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  if (!title && !author) {
    const allSongs = await getSongs();
    return allSongs;
  }

  let query = supabase.from("songs").select("*");

  if (title && author) {
    query = query.or(`title.ilike.%${title}%,author.ilike.%${author}%`);
  } else if (title) {
    query = query.ilike("title", `%${title}%`);
  } else if (author) {
    query = query.ilike("author", `%${author}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) console.log(error);

  return (data as any) || [];
};

export default getSongsByTitle;
