import { useForm } from "react-hook-form";
import { FaUserShield } from "react-icons/fa";
import { authHooks } from "@/hooks/useAuth";
import { branchHooks } from "@/hooks/useBranch";

type MakeBranchAdminFormValues = {
  branchId: string;
  userName: string;
};

const objectIdPattern = /^[a-fA-F0-9]{24}$/;
const userNamePattern = /^[a-zA-Z0-9_]+$/;

const MakeBranchAdminPage = () => {
  const { isAppAdmin } = authHooks.useUser();
  const { mutate: assignBranchAdmin, isPending } =
    branchHooks.useAssignBranchAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MakeBranchAdminFormValues>({
    defaultValues: {
      branchId: "",
      userName: "",
    },
  });

  const onSubmit = (data: MakeBranchAdminFormValues) => {
    assignBranchAdmin(
      {
        branchId: data.branchId.trim(),
        userName: data.userName.trim(),
      },
      {
        onSuccess: () => reset(),
      }
    );
  };

  if (!isAppAdmin) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
        Only app admins can access this page.
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-gray-900">
        Make Branch Admin
      </h1>

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Branch ID
            </label>
            <input
              type="text"
              {...register("branchId", {
                required: "Branch ID is required",
                pattern: {
                  value: objectIdPattern,
                  message: "Branch ID must be a valid 24-character ID",
                },
              })}
              placeholder="Enter branch ID"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.branchId?.message && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.branchId.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("userName", {
                required: "Username is required",
                pattern: {
                  value: userNamePattern,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
              placeholder="Enter username"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.userName?.message && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.userName.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaUserShield className="h-4 w-4" />
            {isPending ? "Assigning..." : "Make Branch Admin"}
          </button>
        </form>
      </div>
    </>
  );
};

export default MakeBranchAdminPage;
