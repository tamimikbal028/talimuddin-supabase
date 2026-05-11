import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import BranchFinanceTransactions from "@/components/Branch/details-page-tabs/finance/BranchFinanceTransactions";
import BranchFinanceCategories from "@/components/Branch/details-page-tabs/finance/BranchFinanceCategories";
import BranchFinanceReports from "@/components/Branch/details-page-tabs/finance/BranchFinanceReports";
import BranchFinanceExport from "@/components/Branch/details-page-tabs/finance/BranchFinanceExport";

// ── Main Component ────────────────────────────────────────────────
type SubTab = "TRANSACTIONS" | "CATEGORIES" | "REPORTS" | "EXPORT";

const BranchFinanceTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("TRANSACTIONS");

  return (
    <div className="space-y-5">
      {/* Header & Sub-tabs */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <FaWallet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Branch Finance
              </h1>
              <p className="text-sm text-gray-500">Income & Expense tracker</p>
            </div>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="scroller-hidden flex gap-2 overflow-x-auto px-4 pt-2">
          {(
            [
              { id: "TRANSACTIONS", label: "Transactions" },
              { id: "CATEGORIES", label: "Categories" },
              { id: "REPORTS", label: "Reports & Summary" },
              { id: "EXPORT", label: "Downloads" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors sm:px-6 sm:text-sm ${
                activeSubTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === "TRANSACTIONS" && <BranchFinanceTransactions />}
      {activeSubTab === "CATEGORIES" && <BranchFinanceCategories />}
      {activeSubTab === "REPORTS" && <BranchFinanceReports />}
      {activeSubTab === "EXPORT" && <BranchFinanceExport />}
    </div>
  );
};

export default BranchFinanceTab;
