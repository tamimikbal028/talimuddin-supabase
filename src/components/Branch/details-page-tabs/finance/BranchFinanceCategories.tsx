import { useState } from "react";
import { FaArrowUp, FaArrowDown, FaChevronDown } from "react-icons/fa";
import { branchHooks } from "@/hooks/useBranch";
import { authHooks } from "@/hooks/useAuth";
import BranchFinanceFilter, {
  type FilterType,
} from "@/components/Branch/details-page-tabs/finance/BranchFinanceFilter";
import BranchFinanceEmptyState from "@/components/Branch/details-page-tabs/finance/BranchFinanceEmptyState";
import type { FinanceType, FinanceEntry } from "@/types";
import {
  formatCurrency,
  formatDate,
} from "@/components/Branch/details-page-tabs/finance/financeUtils";
import confirm from "@/utils/sweetAlert";

const CategoryEntryRow = ({
  entry,
  onDelete,
  isDeleting,
  isAppAdmin,
}: {
  entry: FinanceEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isAppAdmin: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const details = entry.details ?? [];
  const hasDetails = details.length > 0;
  const hasNote = Boolean(entry.note);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`w-full cursor-pointer px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${isExpanded ? "bg-blue-50/50" : "bg-white"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatDate(entry.date)}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                  entry.type === "INCOME"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {entry.type === "INCOME" ? (
                  <FaArrowUp className="h-2.5 w-2.5" />
                ) : (
                  <FaArrowDown className="h-2.5 w-2.5" />
                )}
                {entry.type === "INCOME" ? "Income" : "Expense"}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-800">
              {entry.personName || entry.category}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`text-sm font-bold ${
                entry.type === "INCOME" ? "text-green-600" : "text-red-600"
              }`}
            >
              {entry.type === "INCOME" ? "+" : "-"}
              {formatCurrency(entry.amount)}
            </span>
            <FaChevronDown
              className={`h-3 w-3 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-x border-b border-gray-200 bg-gray-50 px-4 py-3">
          {hasNote && (
            <p className="mb-2 text-sm text-gray-600">{entry.note}</p>
          )}
          {hasDetails && (
            <div className="space-y-1">
              {details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">{item.itemName}</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {!isAppAdmin && (
            <button
              type="button"
              onClick={() => onDelete(entry._id)}
              disabled={isDeleting}
              className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Entry"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const BranchFinanceCategories = () => {
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filters =
    filterType === "ALL" ? { page } : { type: filterType as FinanceType, page };

  const { isAppAdmin } = authHooks.useUser();

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    branchHooks.useBranchFinanceCategories(filters);
  const { mutate: deleteEntry, isPending: isDeleting } =
    branchHooks.useDeleteFinanceEntry();

  const handleDelete = async (entryId: string) => {
    const ok = await confirm({
      title: "Delete Entry?",
      text: "This cannot be undone.",
      confirmButtonText: "Yes, delete",
      isDanger: true,
    });
    if (ok) deleteEntry(entryId);
  };

  const categories = categoriesData?.data.categories ?? [];
  const pagination = categoriesData?.data.pagination;

  const handleFilterChange = (newType: FilterType) => {
    setFilterType(newType);
    setPage(1);
    setExpandedCategory(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
          Categories
        </h2>
      </div>

      <BranchFinanceFilter
        filterType={filterType}
        setFilterType={handleFilterChange}
        entriesCount={pagination?.totalDocs ?? categories.length}
      />

      {isCategoriesLoading ? (
        <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-50" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <BranchFinanceEmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="hidden border-b border-gray-100 bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_110px_110px_110px_32px] sm:items-center sm:gap-4">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Category
            </span>
            <span className="text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Income
            </span>
            <span className="text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Expense
            </span>
            <span className="text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Balance
            </span>
            <span />
          </div>

          <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 sm:hidden">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Categories
            </span>
          </div>

          {/* Category Rows */}
          {categories.map((cat) => {
            const isOpen = expandedCategory === cat.category;
            return (
              <div
                key={cat.category}
                className="border-b border-gray-200 last:border-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCategory(isOpen ? null : cat.category)
                  }
                  className={`flex w-full items-center justify-between px-4 py-3 transition-colors sm:grid sm:grid-cols-[minmax(0,1fr)_110px_110px_110px_32px] sm:items-center sm:gap-4 ${isOpen ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="truncate text-sm font-bold text-gray-800">
                      {cat.category}
                    </span>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {cat.entries.length}
                    </span>
                  </div>

                  <div className="hidden text-right text-sm text-green-600 sm:block">
                    +{formatCurrency(cat.income)}
                  </div>
                  <div className="hidden text-right text-sm text-red-600 sm:block">
                    -{formatCurrency(cat.expense)}
                  </div>
                  <div
                    className={`hidden text-right text-sm font-bold sm:block ${
                      cat.balance >= 0 ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {cat.balance >= 0 ? "+" : ""}
                    {formatCurrency(cat.balance)}
                  </div>
                  <div className="hidden justify-end sm:flex">
                    <FaChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Mobile summary */}
                  <div className="flex shrink-0 flex-col items-end gap-1 sm:hidden">
                    <span className="text-xs text-green-600">
                      +{formatCurrency(cat.income)}
                    </span>
                    <span className="text-xs text-red-600">
                      -{formatCurrency(cat.expense)}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        cat.balance >= 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {cat.balance >= 0 ? "+" : ""}
                      {formatCurrency(cat.balance)}
                    </span>
                    <FaChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Category Entries */}
                {isOpen && (
                  <div className="border-t border-gray-100">
                    {cat.entries.map((entry) => (
                      <CategoryEntryRow
                        key={entry._id}
                        entry={entry}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        isAppAdmin={isAppAdmin}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchFinanceCategories;
