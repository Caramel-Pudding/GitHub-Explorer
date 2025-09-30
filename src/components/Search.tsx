"use client";

import { useState } from "react";
import { useGitHubSearch } from "@/lib/hooks/useGitHubSearch";
import { UserDropdown } from "@/components/UserDropdown";

export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const { data = [], isFetching, error } = useGitHubSearch(searchQuery);

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

      {searchQuery && error && (
        <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to search users: {error.message}
        </div>
      )}

      {searchQuery && !isFetching && !error && data.length === 0 && (
        <div className="rounded bg-gray-100 px-4 py-3 text-sm text-gray-600">
          No users found for &quot;{searchQuery}&quot;
        </div>
      )}

      {searchQuery && !isFetching && !error && data.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Showing users for &quot;{searchQuery}&quot;
          </p>
          <div className="space-y-2">
            {data.map((user) => (
              <UserDropdown
                key={user.id}
                user={user}
                isExpanded={expandedUserId === user.id}
                onToggle={() => {
                  setExpandedUserId(
                    expandedUserId === user.id ? null : user.id,
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
