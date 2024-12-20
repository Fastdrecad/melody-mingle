"use client";

import { usePathname, useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const MobileNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex md:hidden gap-x-2 items-center">
      <button
        onClick={() => router.push("/")}
        className={twMerge(
          `rounded-full p-2 bg-white flex items-center justify-center
          hover:opacity-75 transition`,
          pathname !== "/" && "opacity-75"
        )}
      >
        <HiHome className="text-black" size={20} />
      </button>
      <button
        onClick={() => router.push("/search")}
        className={twMerge(
          `rounded-full p-2 bg-white flex items-center justify-center
          hover:opacity-75 transition`,
          !pathname?.startsWith("/search") && "opacity-75"
        )}
      >
        <BiSearch className="text-black" size={20} />
      </button>
    </div>
  );
};

export default MobileNavigation;
