import { supabase } from "@/lib/supabase";
import type {
  User,
  ApiResponse,
  UpdateGeneralData,
  ProfileHeaderData,
  UserType,
  AccountStatus,
  Gender,
} from "@/types";

interface SupabaseProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  user_name: string | null;
  phone_number: string | null;
  avatar: string | null;
  cover_image: string | null;
  bio: string | null;
  gender: Gender | null;
  user_type: UserType;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

// Helper to map Supabase profile to our User interface
const mapProfileToUser = (profile: SupabaseProfile): User => {
  return {
    _id: profile.id,
    fullName: profile.full_name || "",
    email: profile.email || "",
    userName: profile.user_name || "",
    phoneNumber: profile.phone_number || "",
    avatar: profile.avatar || undefined,
    coverImage: profile.cover_image || undefined,
    bio: profile.bio || undefined,
    gender: profile.gender || undefined,
    userType: profile.user_type,
    accountStatus: profile.account_status,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

export const profileService = {
  // Get Profile by Username
  getProfileHeader: async (
    username: string
  ): Promise<ApiResponse<ProfileHeaderData>> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_name", username)
      .single();

    if (error) throw error;

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    return {
      success: true,
      statusCode: 200,
      message: "Profile fetched",
      data: {
        user: mapProfileToUser(data),
        isOwnProfile: currentUser?.id === data.id,
      },
    };
  },

  // Update General Info
  updateGeneral: async (
    data: UpdateGeneralData
  ): Promise<ApiResponse<{ user: User }>> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        bio: data.bio,
        gender: data.gender,
        phone_number: data.phoneNumber,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: { user: mapProfileToUser(updatedProfile) },
    };
  },

  // Update Avatar Image
  updateAvatar: async (
    formData: FormData
  ): Promise<ApiResponse<{ user: User }>> => {
    const file = formData.get("avatar") as File;
    if (!file) throw new Error("No file provided");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 1. Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("branch-images") // Reusing the public bucket
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("branch-images").getPublicUrl(filePath);

    // 3. Update profiles table
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ avatar: publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      success: true,
      statusCode: 200,
      message: "Avatar updated",
      data: { user: mapProfileToUser(updatedProfile) },
    };
  },

  // Update Cover Image
  updateCoverImage: async (
    formData: FormData
  ): Promise<ApiResponse<{ user: User }>> => {
    const file = formData.get("coverImage") as File;
    if (!file) throw new Error("No file provided");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    // 1. Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("branch-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("branch-images").getPublicUrl(filePath);

    // 3. Update profiles table
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ cover_image: publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      success: true,
      statusCode: 200,
      message: "Cover image updated",
      data: { user: mapProfileToUser(updatedProfile) },
    };
  },
};

export default profileService;
