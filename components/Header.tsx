"use client";

import MobileNavigation from "@/components/MobileNavigation";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const pathname = usePathname();
  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();

  const { user, userDetails } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    // Reset any playing songs
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out!");
    }
  };

  return (
    <div
      className={twMerge(
        "h-fit bg-gradient-to-b from-emerald-800 md:p-6 p-3",
        className
      )}
    >
      <div className="w-full mb4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <MobileNavigation />
        <div className="flex justify-between items-center md:gap-x-4 gap-x-2">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-white">
                Logout
              </Button>
              <Button onClick={() => router.push("/account")} variant="avatar">
                {userDetails?.avatar_url ? (
                  <div className="relative h-full w-full">
                    <Image
                      fill
                      src={userDetails.avatar_url}
                      alt="Profile"
                      className="object-cover rounded-full"
                      sizes="38px"
                      onError={(e) => {
                        console.error("Avatar image load error");
                        e.currentTarget.src = "";
                      }}
                    />
                  </div>
                ) : (
                  <FaUserAlt className="text-gray-900" size={20} />
                )}
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={authModal.onOpen}
                className="bg-transparent text-neutral-300 font-medium whitespace-nowrap"
              >
                Sign Up
              </Button>

              <Button
                onClick={authModal.onOpen}
                className="bg-white px-6 py-2 whitespace-nowrap"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
