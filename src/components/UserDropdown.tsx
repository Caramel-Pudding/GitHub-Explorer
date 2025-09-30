"use client";

import { useUserRepositories } from "@/lib/hooks/useUserRepositories";
import type { GitHubUser } from "@/lib/schemas/github";

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
        className="flex w-full items-center justify-between rounded bg-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isExpanded}
        aria-controls={`repos-${String(user.id)}`}
      >
        <span className="font-medium text-gray-900">{user.login}</span>
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          className={`h-5 w-5 text-gray-700 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div
          id={`repos-${String(user.id)}`}
          className="space-y-2 pl-2"
          role="region"
          aria-label={`Repositories for ${user.login}`}
        >
          {isLoading && (
            <div className="rounded bg-gray-100 px-4 py-3 text-sm text-gray-600">
              Loading repositories...
            </div>
          )}

          {error && (
            <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to load repositories: {error.message}
            </div>
          )}

          {!isLoading && !error && repositories.length === 0 && (
            <div className="rounded bg-gray-100 px-4 py-3 text-sm text-gray-600">
              No repositories found
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
                className="block rounded bg-gray-100 px-4 py-3 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
