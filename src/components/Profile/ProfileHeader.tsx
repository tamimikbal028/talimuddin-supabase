import { Link } from "react-router-dom";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import type { ProfileHeaderData } from "@/types";
import { authHooks } from "@/hooks/useAuth";
import { CoverImage } from "@/components/shared/FallbackImage";

interface Props {
  data: ProfileHeaderData;
}

const ProfileHeader = ({ data }: Props) => {
  const { user: userData } = data;
  const { user: currentUser } = authHooks.useUser();
  const { mutate: logout, isPending: isLoggingOut } = authHooks.useLogout();
  const isOwnProfile = currentUser?._id === userData._id;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-32 w-full sm:h-48">
          <CoverImage
            src={userData.coverImage}
            name={userData.fullName}
            className="h-full w-full object-cover"
            showName={true}
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1 space-y-1">
              <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {userData.fullName}
              </h1>
              <p className="text-sm leading-relaxed font-medium text-gray-600 sm:text-base">
                {userData.bio ? userData.bio : "No bio added yet."}
              </p>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <Link
                  to="/profile/edit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 sm:flex-none"
                >
                  <FaEdit className="h-4 w-4" />
                  Edit Profile
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  {isLoggingOut ? "..." : "Sign Out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
