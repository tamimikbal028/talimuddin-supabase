import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileNotFound from "@/components/Profile/ProfileNotFound";
import { profileHooks } from "@/hooks/useProfile";
import ProfileHeaderSkeleton from "@/components/shared/skeletons/ProfileHeaderSkeleton";

const Profile = () => {
  const {
    data: profileData,
    isLoading,
    error,
  } = profileHooks.useProfileHeader();

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (error || !profileData) {
    return <ProfileNotFound />;
  }

  return <ProfileHeader data={profileData} />;
};

export default Profile;
