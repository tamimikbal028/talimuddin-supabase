import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";
import type { UpdateGeneralData, ApiError } from "@/types";
import type { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { AUTH_KEYS } from "@/hooks/useAuth";

const FIVE_MIN = 1000 * 60 * 5;

const defaultProfileQueryOptions = {
  staleTime: FIVE_MIN,
  retry: 1,
};

const useProfileHeader = () => {
  const { username } = useParams();
  return useQuery({
    queryKey: ["profileHeader", username],
    queryFn: async () => {
      const response = await profileService.getProfileHeader(
        username as string
      );
      return response.data;
    },
    ...defaultProfileQueryOptions,
  });
};

// Update hooks
const useUpdateGeneral = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileService.updateGeneral(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      // Invalidate branch queries since user name appears on branch cards
      queryClient.invalidateQueries({ queryKey: ["myBranch"] });
      queryClient.invalidateQueries({ queryKey: ["hiddenBranches"] });
      queryClient.invalidateQueries({ queryKey: ["archivedRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });

      navigate(`/profile/${response.data.user.userName}`);
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update General failed");
    },
  });
};

const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => profileService.updateAvatar(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update Avatar failed");
    },
  });
};

const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) =>
      profileService.updateCoverImage(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message ?? "Update Cover Image failed"
      );
    },
  });
};

const profileHooks = {
  useProfileHeader,
  useUpdateGeneral,
  useUpdateAvatar,
  useUpdateCoverImage,
} as const;

export { profileHooks };
