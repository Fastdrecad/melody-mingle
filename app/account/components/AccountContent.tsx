"use client";

import Button from "@/components/Button";
import MobileNavigation from "@/components/MobileNavigation";
import useLikedSongs, { useInitializeLikedSongs } from "@/hooks/useLikedSongs";
import { useLogout } from "@/hooks/useLogout";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";

const AccountContent = () => {
  const router = useRouter();
  const { user, userDetails } = useUser();
  const { likedSongIds, isLoading: isLoadingLikes } = useLikedSongs();
  const { logout, isLoading: isLoggingOut } = useLogout();
  useInitializeLikedSongs();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="mb-7 px-6">
      <div className="flex flex-col justify-center gap-y-6">
        {/* Profile Section */}
        <div className="flex items-center justify-between gap-x-4">
          {/* Mobile Navigation */}
          <MobileNavigation />
          <div className="relative h-20 w-20 rounded-full aspect-square bg-neutral-700 flex items-center justify-center">
            {userDetails?.avatar_url ? (
              <Image
                fill
                src={userDetails.avatar_url}
                alt="Profile"
                className="object-cover"
                sizes="(max-width: 768px) 80px, 80px"
                onError={(e) => {
                  console.error("Avatar image load error");
                  e.currentTarget.src = "";
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <FaUserAlt size={40} className="text-neutral-400" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-2xl font-semibold">
            {userDetails?.full_name || "My Profile"}
          </h1>
          <p className="text-neutral-400">{user?.email}</p>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Your Library</h3>
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Liked Songs</span>
              <span>
                {isLoadingLikes ? "Loading..." : `${likedSongIds.length} songs`}
              </span>
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Account Type</h3>
            <p className="text-sm text-neutral-400">Free Account</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-neutral-800 rounded-lg p-4 w-fit self-center">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/account/edit")}
              className="w-full md:w-auto whitespace-nowrap"
            >
              Edit Profile
            </Button>
            <Button
              onClick={logout}
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 whitespace-nowrap"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountContent;
