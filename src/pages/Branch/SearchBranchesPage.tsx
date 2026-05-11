import { useDeferredValue, useState } from "react";
import { FaSearch } from "react-icons/fa";
import BranchCard from "@/components/Branch/BranchCard";
import BranchCardSkeleton from "@/components/shared/skeletons/BranchCardSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { BRANCH_LIMIT } from "@/constants";
import { branchHooks } from "@/hooks/useBranch";

const SearchBranchesPage = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = branchHooks.useSearchBranches(deferredQuery);

  const branches = data?.pages.flatMap((page) => page.data.branches) ?? [];
  const totalDocs = data?.pages[0]?.data.pagination.totalDocs ?? 0;

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-gray-900">
        Search Branches
      </h1>

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Search by Branch Name
        </label>
        <div className="relative">
          <FaSearch className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type branch name..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-11 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {deferredQuery.length === 0 ? (
        <EmptyState icon={FaSearch} message="Start typing to search branches" />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(BRANCH_LIMIT)].map((_, index) => (
            <BranchCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error.response?.data?.message || error.message} />
      ) : branches.length === 0 ? (
        <EmptyState
          icon={FaSearch}
          message={`No branches found for "${deferredQuery}"`}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({totalDocs})
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard key={branch._id} branch={branch} />
            ))}

            {isFetchingNextPage &&
              [...Array(BRANCH_LIMIT)].map((_, index) => (
                <BranchCardSkeleton key={`search-skeleton-${index}`} />
              ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBranchesPage;
