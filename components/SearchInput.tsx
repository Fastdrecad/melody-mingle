"use client";

import qs from "query-string";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 300);

  useEffect(() => {
    const query = {
      title: debouncedValue,
      author: debouncedValue
    };

    const url = qs.stringifyUrl({
      url: "/search",
      query: query
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="Search by song title or artist..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
