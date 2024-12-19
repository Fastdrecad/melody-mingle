"use client";

import Button from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa";

const AccountContent = () => {
  const router = useRouter();
  const { userDetails, subscription, isLoading } = useUser();

  const getInitials = () => {
    if (!userDetails?.full_name) return "U";

    return userDetails.full_name
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (!isLoading && !userDetails) {
      router.replace("/");
    }
  }, [isLoading, userDetails, router]);

  if (isLoading || !userDetails) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="mb-7 px-6">
      <div className="flex flex-col gap-y-4">
        {/* Profile */}
        <div className="flex items-center gap-x-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center">
            {userDetails.avatar_url ? (
              <Image
                fill
                src={userDetails.avatar_url}
                alt="Profile"
                className="object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {getInitials()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-semibold">
              My Information
            </h1>
            <p className="text-neutral-400 w-1/2">{userDetails.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="bg-neutral-800 rounded-lg p-4 flex flex-col items-center justify-center">
            <h2 className="text-white text-xl font-semibold mb-4">
              Account Settings
            </h2>
            <div className="flex flex-col gap-y-4 w-1/2 items-center justify-center">
              <Button onClick={() => {}} className="w-full ">
                Change Password
              </Button>
              <Button
                onClick={() => {}}
                className="w-full  bg-red-500 hover:bg-red-600"
              >
                Sign Out
              </Button>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4 flex flex-col items-center justify-center">
            <h2 className="text-white text-xl font-semibold mb-4">
              {subscription ? "Your subscription" : "No subscription"}
            </h2>
            {subscription ? (
              <div className="text-neutral-400 w-1/2">
                <p>Plan: {subscription.price_id}</p>
                <p>Status: Active</p>
                <Button onClick={() => {}} className="mt-4">
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <div className="text-neutral-400 w-1/2">
                <div className="flex flex-col items-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
                    <FaUser size={40} className="text-neutral-400" />
                  </div>
                  <p>No active subscription</p>
                </div>
                <Button
                  onClick={() => router.push("/subscribe")}
                  className="w-full"
                >
                  Subscribe Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountContent;
