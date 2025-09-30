"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchGitHubUsers } from "@/lib/api/github";

export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data = [], isFetching } = useQuery({
    queryKey: ["GitHubUserSearch", searchQuery],
    queryFn: () => searchGitHubUsers(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          id="search-input"
          type="text"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          placeholder="Enter username..."
          aria-label="Search GitHub users"
          className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isFetching}
          className="w-full rounded bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {searchQuery && !isFetching && data.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Showing users for &quot;{searchQuery}&quot;
          </p>
          <div className="space-y-2">
            {data.map((user) => (
              <button
                key={user.id}
                type="button"
                className="flex w-full items-center justify-between rounded bg-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="font-medium text-gray-900">{user.login}</span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  className="h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
