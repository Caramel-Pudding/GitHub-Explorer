# GitHub Explorer

https://git-hub-explorer-demo.vercel.app/

A modern web application built with Next.js 15 and React 19 that allows users to search for GitHub users and explore their repositories with a clean, intuitive interface.

## Features

- **GitHub User Search** - Search for GitHub users by username with real-time results
- **Repository Exploration** - View user repositories with expandable dropdowns showing:
  - Repository name and description
  - Star count
  - Direct links to repositories
- **Comprehensive Error Handling** - Graceful error states for API failures and rate limiting
- **Empty State Management** - Clear feedback when no results are found
- **Loading States** - Smooth loading indicators during data fetching
- **Type-Safe** - Full TypeScript coverage with strict type checking
- **Tested** - Comprehensive unit tests with Vitest and Testing Library

## Tech Stack

- **Framework**: Next.js 15.5.0 with Turbopack
- **UI Library**: React 19.1.0
- **Data Fetching**: TanStack Query (@tanstack/react-query)
- **Styling**: Tailwind CSS v3
- **Validation**: Zod for runtime type validation
- **Testing**: Vitest with Testing Library and jsdom
- **Type Checking**: TypeScript 5 with enhanced strictness
- **Linting**: ESLint 9 (flat config) with extensive plugins
- **Git Hooks**: Husky for pre-commit validation

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd github-explorer

# Install dependencies
npm install
```

### Development

```bash
# Start development server with Turbopack
npm run dev

# Open http://localhost:3000 in your browser
```

### Optional: GitHub Token

To avoid rate limiting, you can add a GitHub personal access token:

1. Create a `.env.local` file in the root directory
2. Add: `NEXT_PUBLIC_GITHUB_TOKEN=your_token_here`

This increases the rate limit from 60 requests/hour to 5,000 requests/hour.

## Available Scripts

### Development
```bash
npm run dev              # Start development server with Turbopack
npm run type-check:watch # Watch mode for type checking (relaxed rules)
npm run type-check:dev   # One-time type check for development
```

### Testing
```bash
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage report
```

### Building & Production
```bash
npm run build            # Build for production with Turbopack
npm start                # Start production server
npm run preview          # Build and start production server
npm run analyze          # Build with bundle analysis
```

### Code Quality
```bash
npm run lint             # Run ESLint (fails on any warnings)
npm run lint:fix         # Auto-fix ESLint issues
npm run lint:report      # Generate HTML report
npm run type-check       # Full type check with strict rules
npm run validate         # Run type-check, lint, and test:run in parallel
```

### Maintenance
```bash
npm run clean            # Remove build artifacts and cache
npm run clean:full       # Also remove coverage and reports
npm run clean:deps       # Reinstall dependencies from scratch
npm run audit            # Check for security vulnerabilities
npm run deps:check       # Check for outdated dependencies
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (server component)
│   ├── providers.tsx      # QueryClientProvider wrapper
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Search.tsx        # Main search UI
│   ├── UserDropdown.tsx  # Expandable user card with repos
│   └── Icons.tsx         # Reusable SVG icon components
├── lib/                   # Core application logic
│   ├── api/
│   │   └── github.ts     # GitHub API client
│   ├── hooks/
│   │   ├── useGitHubSearch.ts      # User search query hook
│   │   └── useUserRepositories.ts  # Repository query hook
│   ├── schemas/
│   │   └── github.ts     # Zod schemas for validation
│   ├── constants.ts      # App constants (API config, UI text)
│   ├── queryKeys.ts      # Centralized query key factory
│   └── styles.ts         # Shared Tailwind class constants
└── __tests__/             # Test files
    ├── setup.ts          # Vitest configuration
    ├── Search.test.tsx   # Search component tests
    ├── UserDropdown.test.tsx  # UserDropdown component tests
    └── utils/
        └── testUtils.tsx # Shared test utilities
```

## Architecture Highlights

### Centralized Configuration

The application uses centralized configuration files for maintainability:

- **queryKeys.ts** - Centralized query key factory for all TanStack Query keys
- **constants.ts** - API configuration, limits, cache times, and UI text
- **styles.ts** - Shared Tailwind CSS class constants for consistent styling
- **Icons.tsx** - Reusable SVG icon components (ChevronDown, Star)

### Query Hooks Pattern

All data fetching uses dedicated custom hooks following a consistent pattern:

- **useGitHubSearch** - Handles user search using centralized query keys
- **useUserRepositories** - Handles repository fetching with conditional enabling

Benefits:
- Centralized query key management via `queryKeys` factory
- Consistent caching and refetching behavior
- Easy to test (mock hooks instead of API calls)
- Clear component contracts
- Configuration-driven approach (constants, styles)

### Error Handling

Comprehensive error states throughout the application:
- API errors display user-friendly messages
- Empty states clearly distinguish from errors
- Loading states prevent UI flickering

### Type Safety

Extremely strict TypeScript configuration:
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- Runtime validation with Zod schemas
- Compile-time and runtime type safety

### Schema Validation

All GitHub API responses are validated with Zod schemas:
- Prevents runtime errors from unexpected API changes
- Type inference for TypeScript
- Clear error messages for debugging

## Testing

### Test Coverage

<img width="897" height="759" alt="Screenshot 2025-10-02 at 12 05 13" src="https://github.com/user-attachments/assets/9154ea44-fa3a-4cf3-bb31-34e9ee771bff" />


### Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Single run (used in CI and pre-commit)
npm run test:run

# With coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

## Code Quality

### ESLint Configuration

ESLint 9 flat config with extensive plugins:
- TypeScript ESLint (recommended, strict, stylistic)
- unused-imports (auto-removes unused imports)
- security (detects potential security issues)
- sonarjs (cognitive complexity checks, code smells)
- unicorn (modern JavaScript patterns)
- Prettier integration

### Pre-commit Validation

Husky pre-commit hook runs `npm run validate`:
- Type checking (strict mode)
- Linting (max-warnings: 0)
- All tests must pass

## GitHub API Integration

The app uses the GitHub REST API:
- `/search/users` - User search (10 requests/minute limit)
- `/users/{username}/repos` - User repositories (60 requests/hour limit)

**Rate Limit Handling:**
- Unauthenticated: 60 requests/hour
- With token: 5,000 requests/hour
- Errors are displayed to users when limits are exceeded

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Ensure tests pass: `npm run validate`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code patterns (custom hooks, query factories)
- Write tests for new features
- Ensure `npm run validate` passes before committing
- Use TypeScript strict mode
- Add Zod schemas for new API responses

## License

This project is private and not licensed for public use.
