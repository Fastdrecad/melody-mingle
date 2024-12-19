"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Clean the URL and redirect to home
    if (window.location.hash || window.location.search) {
      router.replace("/");
    }
  }, [router]);

  return null; // This component doesn't render anything
}
