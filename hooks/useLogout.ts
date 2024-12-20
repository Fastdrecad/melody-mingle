import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useLikedSongs from "./useLikedSongs";
import usePlayer from "./usePlayer";

export const useLogout = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const { reset: resetLikedSongs } = useLikedSongs();
  const player = usePlayer();

  const logout = async () => {
    try {
      setIsLoading(true);

      // 1. Prvo se izlogujemo iz Supabase
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        throw error;
      }

      // 2. Resetujemo sve store-ove
      resetLikedSongs();
      player.reset();

      // 3. Prikazujemo success poruku
      toast.success("Logged out!");

      // 4. Redirektujemo na home page i refreshujemo
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading
  };
};
