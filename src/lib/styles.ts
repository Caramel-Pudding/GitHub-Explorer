export const styles = {
  input: {
    base: "w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
  },
  button: {
    primary:
      "w-full rounded bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    dropdown:
      "flex w-full items-center justify-between rounded bg-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
  },
  message: {
    error: "rounded bg-red-50 px-4 py-3 text-sm text-red-700",
    info: "rounded bg-gray-100 px-4 py-3 text-sm text-gray-600",
  },
  repository: {
    link: "block rounded bg-gray-100 px-4 py-3 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
  },
} as const;
