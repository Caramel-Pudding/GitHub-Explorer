"use client";

import { useState } from "react";
import { useGitHubSearch } from "@/lib/hooks/useGitHubSearch";

export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data = [], isFetching } = useGitHubSearch(searchQuery);

  console.log(data);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2">
        <input
          id="search-input"
          type="text"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          placeholder="Enter username..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search GitHub users"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isFetching}
        >
          Search
        </button>
      </form>
    </div>
  );
}
