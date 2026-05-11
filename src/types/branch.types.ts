import type { User } from "@/types/user.types";
import type { Pagination } from "@/types/common.types";
import { BRANCH_TYPES } from "@/constants/branch";

export interface Branch {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  branchType: (typeof BRANCH_TYPES)[keyof typeof BRANCH_TYPES];
  parentBranch?: string | { _id: string } | null;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface BranchListItem {
  _id: string;
  name: string;
  coverImage?: string;
}

export interface MyBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      branches: BranchListItem[];
      branchCount: number;
      hasMembership: boolean;
    };
  };
}

export interface AllBranchesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branches: BranchListItem[];
    pagination: Pagination;
  };
}

// Branch Member (from getBranchMembers)
export interface BranchMember {
  user: User;
  isAdmin: boolean;
  joinedAt: string;
  meta: {
    isSelf: boolean;
    canManage: boolean;
    memberId: string;
  };
}

// Update Branch Data (for updateBranch API)
export interface UpdateBranchData {
  name: string;
  description?: string;
  branchType: string;
  parentBranchId?: string;
}

export interface BranchDetailsMeta {
  isMember: boolean;
  isAdmin: boolean;
}

export interface BranchDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branch: Branch;
    meta: BranchDetailsMeta;
  };
}

export interface CreateBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

export interface DeleteBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branchId: string;
  };
}

export interface UpdateBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branch: Branch;
  };
}

export interface BranchMembersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    members: BranchMember[];
    pagination: Pagination;
    meta: {
      isRequesterAdmin: boolean;
    };
  };
}

export interface BaseBranchActionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branchId: string;
  };
}

export interface AssignBranchAdminResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branchId: string;
    userId: string;
    userName: string;
  };
}

// =================== Finance Types ===================

export type FinanceType = "INCOME" | "EXPENSE";

export interface FinanceEntry {
  _id: string;
  branch: string;
  type: FinanceType;
  amount: number;
  category: string;
  note: string;
  date: string;
  recordedBy: {
    _id: string;
    fullName: string;
    avatar?: string;
    userName: string;
    phoneNumber: string;
  };
  personName?: string;
  personPhone?: string;
  details?: {
    itemName: string;
    amount: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FinanceSummary {
  overall: {
    balance: number;
  };

  monthlyStats: Array<{
    year: number;
    month: number;
    income: number;
    expense: number;
    breakdown: Array<{
      category: string;
      type: FinanceType;
      total: number;
      count: number;
    }>;
  }>;
}

export interface FinanceCategory {
  category: string;
  income: number;
  expense: number;
  balance: number;
  entries: FinanceEntry[];
}

export interface BranchFinanceEntriesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    entries: FinanceEntry[];
    pagination: Pagination;
  };
}

export interface BranchFinanceCategoriesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    categories: FinanceCategory[];
    pagination: Pagination;
  };
}

export interface BranchFinanceSummaryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    summary: FinanceSummary;
    pagination: Pagination;
  };
}

export interface BranchFinanceMonthExportResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    year: number;
    month: number;
    entries: FinanceEntry[];
    summary: {
      income: number;
      expense: number;
      balance: number;
      totalEntries: number;
    };
  };
}

export interface CreateFinanceEntryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    entry: FinanceEntry;
  };
}

export interface DeleteFinanceEntryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    entryId: string;
  };
}

export interface CreateFinanceEntryRequest {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  note?: string;
  date: string;
  personName?: string;
  personPhone?: string;
  details?: {
    itemName: string;
    amount: number;
  }[];
}
