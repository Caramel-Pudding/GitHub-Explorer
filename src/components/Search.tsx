"use client";

import { useState } from "react";
import { useGitHubSearch } from "@/lib/hooks/useGitHubSearch";

export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data = [], isFetching } = useGitHubSearch(searchQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          id="search-input"
          type="text"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          placeholder="Enter username..."
          aria-label="Search GitHub users"
        />
        <button type="submit" disabled={isFetching}>
          Search
        </button>
      </form>

      {searchQuery && !isFetching && data.length > 0 && (
        <div>
          <p>Showing users for &quot;{searchQuery}&quot;</p>
          <div>
            {data.map((user) => (
              <button key={user.id} type="button">
                <span>{user.login}</span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
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
