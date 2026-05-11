import { useState } from "react";
import { useParams } from "react-router-dom";
import { branchHooks } from "@/hooks/useBranch";
import { FaSpinner, FaFileExcel } from "react-icons/fa";
import { branchFinanceService } from "@/services/branchFinance.service";
import { toast } from "sonner";
import dayjs from "dayjs";
import { formatCurrency } from "@/components/Branch/details-page-tabs/finance/financeUtils";
import type { FinanceEntry, FinanceSummary } from "@/types";

type MonthlyStat = FinanceSummary["monthlyStats"][number];

const BranchFinanceExport = () => {
  const { branchId } = useParams();
  const [downloadingMonth, setDownloadingMonth] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data: summaryData, isLoading: isSummaryLoading } =
    branchHooks.useBranchFinanceSummary({ page });

  const monthlyStats = summaryData?.data.summary?.monthlyStats ?? [];
  const pagination = summaryData?.data.pagination;

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1).toLocaleString("en-BD", { month: "long" });
  };

  const handleDownloadExcel = async (stat: MonthlyStat) => {
    if (!branchId) return;
    const monthKey = `${stat.year}-${stat.month}`;
    const monthName = getMonthName(stat.month);

    try {
      setDownloadingMonth(monthKey);

      const response = await branchFinanceService.getMonthExport(branchId, {
        year: stat.year,
        month: stat.month,
      });
      const ExcelJS = (await import("exceljs")).default;

      const entries = response.data.entries || [];
      const monthSummary = response.data.summary;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Talimuddin";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet(`${monthName} Report`, {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Name/Phone", key: "namePhone", width: 25 },
        { header: "Note", key: "note", width: 30 },
        { header: "Type", key: "type", width: 15 },
        { header: "Amount", key: "amount", width: 15 },
      ];

      const thinBorder = {
        top: { style: "thin" as const, color: { argb: "FFE5E7EB" } },
        left: { style: "thin" as const, color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin" as const, color: { argb: "FFE5E7EB" } },
        right: { style: "thin" as const, color: { argb: "FFE5E7EB" } },
      };

      const headerRow = worksheet.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F2937" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = thinBorder;
      });

      entries.forEach((entry: FinanceEntry) => {
        const row = worksheet.addRow({
          date: dayjs(entry.date).format("DD MMM, YYYY"),
          category: entry.category,
          namePhone: entry.personName
            ? `${entry.personName} ${entry.personPhone ? `(${entry.personPhone})` : ""}`
            : "-",
          note: entry.note || "-",
          type: entry.type === "INCOME" ? "Income (+)" : "Expense (-)",
          amount: entry.amount,
        });

        const isIncome = entry.type === "INCOME";
        const fillColor = isIncome ? "FFECFDF5" : "FFFEF2F2";
        const fontColor = isIncome ? "FF166534" : "FFB91C1C";

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
          };
          cell.font = { color: { argb: fontColor } };
          cell.alignment = { vertical: "middle", wrapText: true };
          cell.border = thinBorder;
        });

        row.getCell("type").font = { bold: true, color: { argb: fontColor } };
        row.getCell("amount").font = { bold: true, color: { argb: fontColor } };
        row.getCell("amount").numFmt = "#,##0";
        row.getCell("amount").alignment = {
          horizontal: "right",
          vertical: "middle",
        };
      });

      worksheet.addRow({});

      const summaryTitleRow = worksheet.addRow({
        category: "MONTHLY SUMMARY",
      });
      summaryTitleRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDBEAFE" },
        };
        cell.font = { bold: true, color: { argb: "FF1D4ED8" } };
        cell.border = thinBorder;
      });

      const summaryRows = [
        {
          label: "Total Income",
          amount: monthSummary.income,
          fillColor: "FFECFDF5",
          fontColor: "FF166534",
        },
        {
          label: "Total Expense",
          amount: monthSummary.expense,
          fillColor: "FFFEF2F2",
          fontColor: "FFB91C1C",
        },
        {
          label: "Net Balance",
          amount: monthSummary.balance,
          fillColor: "FFEFF6FF",
          fontColor: "FF1D4ED8",
        },
      ];

      summaryRows.forEach(({ label, amount, fillColor, fontColor }) => {
        const row = worksheet.addRow({
          category: label,
          amount,
        });

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
          };
          cell.font = { bold: true, color: { argb: fontColor } };
          cell.border = thinBorder;
        });

        row.getCell("amount").numFmt = "#,##0";
        row.getCell("amount").alignment = {
          horizontal: "right",
          vertical: "middle",
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${monthName}_${stat.year}_Detailed_Report.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading excel report", error);
      toast.error("Failed to download excel report");
    } finally {
      setDownloadingMonth(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-800">
              Export Finance Reports
            </h2>
            <p className="text-sm text-gray-500">
              Download detailed monthly transactions as Excel files.
            </p>
          </div>
        </div>

        {isSummaryLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        ) : monthlyStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <p>No financial records available to export.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthlyStats.map((stat) => (
              <div
                key={`${stat.year}-${stat.month}`}
                className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">
                    {getMonthName(stat.month)} {stat.year}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:gap-3">
                    <span className="font-medium text-green-600">
                      Income: {formatCurrency(stat.income)}
                    </span>
                    <span className="font-medium text-red-600">
                      Expense: {formatCurrency(stat.expense)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadExcel(stat)}
                  disabled={downloadingMonth === `${stat.year}-${stat.month}`}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all ring-inset hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  {downloadingMonth === `${stat.year}-${stat.month}` ? (
                    <>
                      <FaSpinner className="h-4 w-4 animate-spin text-blue-600" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <FaFileExcel className="h-4 w-4 text-green-600" />
                      <span>Download Excel</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:py-1"
            >
              Previous
            </button>
            <span className="text-center text-sm text-gray-500">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:py-1"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchFinanceExport;
