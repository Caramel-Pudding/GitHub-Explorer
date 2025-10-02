import type { GitHubRepository } from "@/lib/schemas/github";
import { StarIcon } from "@/components/Icons";
import { styles } from "@/lib/styles";

interface RepositoryCardProps {
  repository: GitHubRepository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <a
      href={repository.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.repository.link}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{repository.name}</h3>
          {repository.description && (
            <p className="mt-1 text-sm text-gray-600">
              {repository.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <span>{repository.stargazers_count}</span>
          <StarIcon />
        </div>
      </div>
    </a>
  );
}
