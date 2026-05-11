import type { Gender, User } from "@/types/user.types";

export interface ProfileHeaderData {
  user: User;
  isOwnProfile: boolean;
}

export interface UpdateGeneralData {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  gender?: Gender;
}
