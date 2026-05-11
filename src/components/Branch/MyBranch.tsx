import { branchHooks } from "@/hooks/useBranch";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import BranchCard from "@/components/Branch/BranchCard";
import BranchCardSkeleton from "@/components/shared/skeletons/BranchCardSkeleton";
import { FaSchool } from "react-icons/fa";
import { BRANCH_LIMIT } from "@/constants";

const MyBranch = () => {
  const { data, isLoading, error } = branchHooks.useMyBranch();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(Math.min(3, BRANCH_LIMIT))].map((_, i) => (
            <BranchCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error.response?.data.message || "Failed to load my branch"}
      />
    );
  }

  if (!data) {
    return null;
  }

  const branches = data.data.meta.branches;
  const branchCount = data.data.meta.branchCount;

  if (branches.length === 0) {
    return (
      <EmptyState
        icon={FaSchool}
        message="You are not an admin of any branch yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          My Branches ({branchCount})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <BranchCard key={branch._id} branch={branch} />
        ))}
      </div>
    </div>
  );
};

export default MyBranch;
