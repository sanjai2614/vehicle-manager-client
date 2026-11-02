import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriver,
} from "../services/driver.service";

// Query key
const DRIVERS_QUERY_KEY = ["drivers"];

// Get drivers
export const useDrivers = () => {
  return useQuery({
    queryKey: DRIVERS_QUERY_KEY,
    queryFn: async () => {
      const response = await getDrivers();
      return response.data.data;
    },
  });
};

// Create driver
export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDriver,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DRIVERS_QUERY_KEY,
      });
    },
  });
};

// Update driver
export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateDriver(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DRIVERS_QUERY_KEY,
      });
    },
  });
};

// Delete driver
export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDriver,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DRIVERS_QUERY_KEY,
      });
    },
  });
};


export const useDriver = (id) => {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: () => getDriver(id),
    enabled: !!id,
  });
};