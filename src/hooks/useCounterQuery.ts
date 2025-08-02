import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { indexedDBService } from "../lib/indexedDB";
import { useCounterStore } from "../stores/counterStore";

// Query keys
export const counterKeys = {
  all: ["counters"] as const,
  lists: () => [...counterKeys.all, "list"] as const,
  list: (filters: string) => [...counterKeys.lists(), { filters }] as const,
  details: () => [...counterKeys.all, "detail"] as const,
  detail: (id: string) => [...counterKeys.details(), id] as const,
};

// Get all counters
export const useCounters = () => {
  return useQuery({
    queryKey: counterKeys.lists(),
    queryFn: async () => {
      const counters = await indexedDBService.getAllCounters();
      return counters;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single counter
export const useCounter = (id: string) => {
  return useQuery({
    queryKey: counterKeys.detail(id),
    queryFn: async () => {
      const counter = await indexedDBService.getCounter(id);
      return counter || { id, value: 0, updatedAt: new Date() };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Mutations
export const useUpdateCounter = () => {
  const queryClient = useQueryClient();
  const { setValue } = useCounterStore();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: number }) => {
      await indexedDBService.setCounter(id, value);
      return { id, value };
    },
    onSuccess: (data) => {
      // Update Zustand store
      setValue(data.id, data.value);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: counterKeys.detail(data.id) });

      // Update cache optimistically
      queryClient.setQueryData(counterKeys.detail(data.id), {
        id: data.id,
        value: data.value,
        updatedAt: new Date(),
      });
    },
  });
};

export const useIncrementCounter = () => {
  const queryClient = useQueryClient();
  const { increment } = useCounterStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const currentCounter = await indexedDBService.getCounter(id);
      const currentValue = currentCounter?.value || 0;
      const newValue = currentValue + 1;

      await indexedDBService.setCounter(id, newValue);
      return { id, value: newValue };
    },
    onSuccess: (data) => {
      // Update Zustand store
      increment(data.id);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: counterKeys.detail(data.id) });

      // Update cache optimistically
      queryClient.setQueryData(counterKeys.detail(data.id), {
        id: data.id,
        value: data.value,
        updatedAt: new Date(),
      });
    },
  });
};

export const useDecrementCounter = () => {
  const queryClient = useQueryClient();
  const { decrement } = useCounterStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const currentCounter = await indexedDBService.getCounter(id);
      const currentValue = currentCounter?.value || 0;
      const newValue = currentValue - 1;

      await indexedDBService.setCounter(id, newValue);
      return { id, value: newValue };
    },
    onSuccess: (data) => {
      // Update Zustand store
      decrement(data.id);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: counterKeys.detail(data.id) });

      // Update cache optimistically
      queryClient.setQueryData(counterKeys.detail(data.id), {
        id: data.id,
        value: data.value,
        updatedAt: new Date(),
      });
    },
  });
};

export const useResetCounter = () => {
  const queryClient = useQueryClient();
  const { reset } = useCounterStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await indexedDBService.setCounter(id, 0);
      return { id, value: 0 };
    },
    onSuccess: (data) => {
      // Update Zustand store
      reset(data.id);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: counterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: counterKeys.detail(data.id) });

      // Update cache optimistically
      queryClient.setQueryData(counterKeys.detail(data.id), {
        id: data.id,
        value: 0,
        updatedAt: new Date(),
      });
    },
  });
};
