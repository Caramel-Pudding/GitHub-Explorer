"use client";

import { useUserRepositories } from "@/lib/hooks/useUserRepositories";
import type { GitHubUser } from "@/lib/schemas/github";
import { ChevronDownIcon, StarIcon } from "@/components/Icons";
import { UI_TEXT } from "@/lib/constants";
import { styles } from "@/lib/styles";

interface UserDropdownProps {
  user: GitHubUser;
  isExpanded: boolean;
  onToggle: () => void;
}

export function UserDropdown({
  user,
  isExpanded,
  onToggle,
}: UserDropdownProps) {
  const { data, isLoading, error } = useUserRepositories(
    user.login,
    isExpanded,
  );

  const repositories = data ?? [];

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className={styles.button.dropdown}
        aria-expanded={isExpanded}
        aria-controls={`repos-${String(user.id)}`}
      >
        <span className="font-medium text-gray-900">{user.login}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-700 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div
          id={`repos-${String(user.id)}`}
          className="space-y-2 pl-2"
          role="region"
          aria-label={`Repositories for ${user.login}`}
        >
          {isLoading && (
            <div className={styles.message.info}>
              {UI_TEXT.MESSAGES.LOADING_REPOS}
            </div>
          )}

          {error && (
            <div className={styles.message.error}>
              {UI_TEXT.ERRORS.REPOS_FAILED} {error.message}
            </div>
          )}

          {!isLoading && !error && repositories.length === 0 && (
            <div className={styles.message.info}>
              {UI_TEXT.MESSAGES.NO_REPOS}
            </div>
          )}

          {!isLoading &&
            !error &&
            repositories.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repository.link}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                    {repo.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>{repo.stargazers_count}</span>
                    <StarIcon />
                  </div>
                </div>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
