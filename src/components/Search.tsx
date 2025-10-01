"use client";

import { useState } from "react";
import { useGitHubSearch } from "@/lib/hooks/useGitHubSearch";
import { UserDropdown } from "@/components/UserDropdown";
import { UI_TEXT } from "@/lib/constants";
import { styles } from "@/lib/styles";

export function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const { data = [], isFetching, error } = useGitHubSearch(searchQuery);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleToggleUser = (userId: number) => {
    setExpandedUserId((current) => (current === userId ? null : userId));
  };

  const showResults = searchQuery && !isFetching;
  const hasError = showResults && error;
  const isEmpty = showResults && !error && data.length === 0;
  const hasData = showResults && !error && data.length > 0;

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          id="search-input"
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          placeholder={UI_TEXT.PLACEHOLDERS.SEARCH}
          aria-label={UI_TEXT.LABELS.SEARCH}
          className={styles.input.base}
        />
        <button
          type="submit"
          disabled={isFetching}
          className={styles.button.primary}
        >
          {UI_TEXT.LABELS.SEARCH_BUTTON}
        </button>
      </form>

      {hasError && (
        <div className={styles.message.error}>
          {UI_TEXT.ERRORS.SEARCH_FAILED} {error.message}
        </div>
      )}

      {isEmpty && (
        <div className={styles.message.info}>
          {UI_TEXT.MESSAGES.NO_USERS(searchQuery)}
        </div>
      )}

      {hasData && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {UI_TEXT.MESSAGES.SHOWING_RESULTS(searchQuery)}
          </p>
          <div className="space-y-2">
            {data.map((user) => (
              <UserDropdown
                key={user.id}
                user={user}
                isExpanded={expandedUserId === user.id}
                onToggle={() => {
                  handleToggleUser(user.id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
