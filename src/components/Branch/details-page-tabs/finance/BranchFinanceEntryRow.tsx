import { useState } from "react";
import {
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import type { FinanceEntry } from "@/types";
import {
  formatCurrency,
  formatDate,
} from "@/components/Branch/details-page-tabs/finance/financeUtils";

interface BranchFinanceEntryRowProps {
  entry: FinanceEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isAppAdmin: boolean;
}

const BranchFinanceEntryRow = ({
  entry,
  onDelete,
  isDeleting,
  isAppAdmin,
}: BranchFinanceEntryRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayPersonName = entry.personName || "";
  const displayPersonPhone = entry.personPhone || "";
  const details = entry.details ?? [];
  const hasPersonInfo = Boolean(displayPersonName || displayPersonPhone);
  const hasNote = Boolean(entry.note);
  const hasDetails = details.length > 0;

  return (
    <div className="border-b border-gray-300">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-gray-50 ${isExpanded ? "bg-blue-50/50" : "bg-white"}`}
      >
        <div className="flex items-start justify-between gap-3 sm:hidden">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>
                {new Date(entry.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                  entry.type === "INCOME"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {entry.type === "INCOME" ? (
                  <FaArrowUp className="h-3 w-3" />
                ) : (
                  <FaArrowDown className="h-3 w-3" />
                )}
                {entry.type === "INCOME" ? "Income" : "Expense"}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {entry.category}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
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

        <div className="hidden items-center gap-4 sm:grid sm:grid-cols-[130px_110px_minmax(0,1fr)_minmax(0,1.2fr)_140px_32px]">
          <div className="text-sm text-gray-600">{formatDate(entry.date)}</div>

          <div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                entry.type === "INCOME"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {entry.type === "INCOME" ? (
                <FaArrowUp className="h-3 w-3" />
              ) : (
                <FaArrowDown className="h-3 w-3" />
              )}
              {entry.type === "INCOME" ? "Income" : "Expense"}
            </span>
          </div>

          <div className="min-w-0 text-sm font-medium text-gray-700">
            {entry.category}
          </div>

          <div className="min-w-0 text-sm">
            {hasPersonInfo ? (
              <div className="space-y-0.5">
                <p className="truncate text-gray-700">
                  {displayPersonName || "Unnamed"}
                </p>
                {displayPersonPhone && (
                  <p className="truncate text-xs text-gray-500">
                    {displayPersonPhone}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>

          <div
            className={`text-right text-sm font-bold ${
              entry.type === "INCOME" ? "text-green-600" : "text-red-600"
            }`}
          >
            {entry.type === "INCOME" ? "+" : "-"}
            {formatCurrency(entry.amount)}
          </div>

          <div className="flex justify-end text-gray-400">
            <FaChevronDown
              className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-x border-b border-gray-600 bg-blue-100/70 px-3 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3 lg:flex-2">
              {hasNote && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Note
                  </span>
                  <p className="max-w-full text-justify text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-700">
                    {entry.note}
                  </p>
                </div>
              )}

              {hasDetails && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Breakdown Details
                  </span>
                  <div className="max-w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="space-y-2">
                      {details.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 border-b border-gray-50 pb-2 text-sm last:border-0 last:pb-0"
                        >
                          <span className="min-w-0 wrap-break-word text-gray-600">
                            {item.itemName}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-bold text-gray-900">
                      <span>Total Sum</span>
                      <span>
                        {formatCurrency(
                          details.reduce((sum, item) => sum + item.amount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 lg:flex-1">
              {hasPersonInfo && (
                <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:w-80">
                  {displayPersonName && (
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FaUser className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                          Name
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {displayPersonName}
                        </span>
                      </div>
                    </div>
                  )}

                  {displayPersonPhone && (
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FaPhone className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                          Phone Number
                        </span>
                        <span className="font-semibold">
                          {displayPersonPhone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isAppAdmin && (
                <button
                  type="button"
                  onClick={() => onDelete(entry._id)}
                  disabled={isDeleting}
                  className={`flex h-10 w-full ${isAppAdmin ? "hidden" : ""} items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 sm:w-auto`}
                >
                  <FaTrash className="h-3 w-3" />
                  {isDeleting ? "Deleting..." : "Delete Entry"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchFinanceEntryRow;
