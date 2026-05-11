import { supabase } from "@/lib/supabase";
import type {
  LoginCredentials,
  User,
  ApiResponse,
  RegisterData,
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

export const authService = {
  // Register new user
  register: async (
    userData: RegisterData
  ): Promise<ApiResponse<{ user: User }>> => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          user_name: userData.userName,
          phone_number: userData.phoneNumber,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Registration failed");

    // Fetch the profile created by the trigger
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      success: true,
      statusCode: 201,
      message: "Registration successful",
      data: { user: mapProfileToUser(profile) },
    };
  },

  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User }>> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Login failed");

    // Fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: { user: mapProfileToUser(profile) },
    };
  },

  // Logout user
  logout: async (): Promise<ApiResponse<object>> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return {
      success: true,
      statusCode: 200,
      message: "Logged out successfully",
      data: {},
    };
  },

  // Get Current Logged-in User
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    return {
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      data: { user: mapProfileToUser(profile) },
    };
  },

  // Refresh access token (Supabase handles this automatically)
  refreshToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) throw new Error("Session expired");

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    return {
      success: true,
      statusCode: 200,
      message: "Token refreshed",
      data: { user: mapProfileToUser(profile) },
    };
  },

  // Change Password
  changePassword: async (data: {
    oldPassword?: string; // Not strictly required by Supabase updateUser if already logged in
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
      data: null,
    };
  },
};

export default authService;
