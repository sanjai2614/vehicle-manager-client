import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  updateUserStatus,
  getAllDrivers,
  getDeletedDrivers,
} from "../services/dashboard.service";

// Query keys
export const DASHBOARD_KEYS = {
  users: ["admin", "users"],
  drivers: ["admin", "drivers"],
  deletedDrivers: ["admin", "deleted-drivers"],
};

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.users,
    queryFn: async () => {
      const response = await getUsers();
      return response.data.data;
    },
  });
};

// Update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }) => updateUserStatus(id, { is_active }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_KEYS.users,
      });
    },
  });
};

// Get all drivers
export const useAllDrivers = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.drivers,
    queryFn: async () => {
      const response = await getAllDrivers();
      return response.data.data;
    },
  });
};

// Get deleted drivers
export const useDeletedDrivers = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.deletedDrivers,
    queryFn: async () => {
      const response = await getDeletedDrivers();
      return response.data.data;
    },
  });
};
