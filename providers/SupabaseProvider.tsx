"use client";

import { Database } from "@/types_db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() =>
    createClientComponentClient<Database>()
  );

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabaseClient.auth.getSession();
    };

    checkSession();
  }, [supabaseClient]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;
