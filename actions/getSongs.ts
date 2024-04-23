import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    // .eq('user_id', '4385a75f-0109-4f33-adaf-826d38edcf83')
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  return (data as any) || [];
};

export default getSongs;
