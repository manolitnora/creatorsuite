import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { abTestingService } from '../services/ab-testing';
import type {
  ABTest,
  TestResults,
  TestMetrics,
  CreateABTestDTO,
  UpdateABTestDTO,
  CreateVariantDTO,
  UpdateVariantDTO,
  TestStatus,
} from '../types/ab-testing';
import { toast } from 'react-hot-toast';

// Define query keys as constants to ensure consistency
const QUERY_KEYS = {
  tests: ['ab-tests'] as const,
  test: (id: string) => ['ab-test', id] as const,
  testResults: (id: string) => ['ab-test-results', id] as const,
  testMetrics: (id: string) => ['ab-test-metrics', id] as const,
} as const;

// Define error handler
const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An error occurred';
  toast.error(message);
  return Promise.reject(error);
};

// Define success handler
const handleSuccess = (message: string) => {
  toast.success(message);
};

interface UseABTestsParams {
  status?: TestStatus;
  platform?: string;
  skip?: number;
  limit?: number;
}

export const useABTests = (
  params?: UseABTestsParams,
  options?: UseQueryOptions<ABTest[]>
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.tests, params],
    queryFn: () => abTestingService.getTests(params),
    ...options,
  });
};

export const useABTest = (id: string, options?: UseQueryOptions<ABTest>) => {
  return useQuery({
    queryKey: QUERY_KEYS.test(id),
    queryFn: () => abTestingService.getTest(id),
    enabled: !!id,
    ...options,
  });
};

export const useABTestResults = (id: string, options?: UseQueryOptions<TestResults>) => {
  return useQuery({
    queryKey: QUERY_KEYS.testResults(id),
    queryFn: () => abTestingService.getTestResults(id),
    enabled: !!id,
    ...options,
  });
};

interface UseABTestMetricsParams {
  start_date?: string;
  end_date?: string;
  interval?: 'hour' | 'day' | 'week';
}

export const useABTestMetrics = (
  id: string,
  params?: UseABTestMetricsParams,
  options?: UseQueryOptions<TestMetrics[]>
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.testMetrics(id), params],
    queryFn: () => abTestingService.getTestMetrics(id, params),
    enabled: !!id,
    ...options,
  });
};

export const useCreateABTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateABTestDTO) => abTestingService.createTest(data),
    onSuccess: (newTest) => {
      queryClient.setQueryData<ABTest[]>(QUERY_KEYS.tests, (old = []) => [...old, newTest]);
      handleSuccess('Test created successfully');
    },
    onError: handleError,
  });
};

export const useUpdateABTest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateABTestDTO) => abTestingService.updateTest(id, data),
    onSuccess: (updatedTest) => {
      queryClient.setQueryData(QUERY_KEYS.test(id), updatedTest);
      queryClient.setQueryData<ABTest[]>(QUERY_KEYS.tests, (old = []) =>
        old.map((test) => (test.id === id ? updatedTest : test))
      );
      handleSuccess('Test updated successfully');
    },
    onError: handleError,
  });
};

export const useDeleteABTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => abTestingService.deleteTest(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ABTest[]>(QUERY_KEYS.tests, (old = []) =>
        old.filter((test) => test.id !== id)
      );
      queryClient.removeQueries(QUERY_KEYS.test(id));
      handleSuccess('Test deleted successfully');
    },
    onError: handleError,
  });
};

export const useStartABTest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => abTestingService.startTest(id),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(QUERY_KEYS.test(id));

      // Snapshot the previous value
      const previousTest = queryClient.getQueryData<ABTest>(QUERY_KEYS.test(id));

      // Optimistically update to the new value
      if (previousTest) {
        const optimisticUpdate = { ...previousTest, status: 'running' as TestStatus };
        queryClient.setQueryData(QUERY_KEYS.test(id), optimisticUpdate);
      }

      return { previousTest };
    },
    onError: (err, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTest) {
        queryClient.setQueryData(QUERY_KEYS.test(id), context.previousTest);
      }
      handleError(err);
    },
    onSuccess: (updatedTest) => {
      queryClient.setQueryData(QUERY_KEYS.test(id), updatedTest);
      handleSuccess('Test started successfully');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're up to date
      queryClient.invalidateQueries(QUERY_KEYS.test(id));
    },
  });
};

export const usePauseABTest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => abTestingService.pauseTest(id),
    onMutate: async () => {
      await queryClient.cancelQueries(QUERY_KEYS.test(id));
      const previousTest = queryClient.getQueryData<ABTest>(QUERY_KEYS.test(id));

      if (previousTest) {
        const optimisticUpdate = { ...previousTest, status: 'paused' as TestStatus };
        queryClient.setQueryData(QUERY_KEYS.test(id), optimisticUpdate);
      }

      return { previousTest };
    },
    onError: (err, _, context) => {
      if (context?.previousTest) {
        queryClient.setQueryData(QUERY_KEYS.test(id), context.previousTest);
      }
      handleError(err);
    },
    onSuccess: (updatedTest) => {
      queryClient.setQueryData(QUERY_KEYS.test(id), updatedTest);
      handleSuccess('Test paused successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries(QUERY_KEYS.test(id));
    },
  });
};

export const useEndABTest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => abTestingService.endTest(id),
    onMutate: async () => {
      await queryClient.cancelQueries(QUERY_KEYS.test(id));
      const previousTest = queryClient.getQueryData<ABTest>(QUERY_KEYS.test(id));

      if (previousTest) {
        const optimisticUpdate = { ...previousTest, status: 'completed' as TestStatus };
        queryClient.setQueryData(QUERY_KEYS.test(id), optimisticUpdate);
      }

      return { previousTest };
    },
    onError: (err, _, context) => {
      if (context?.previousTest) {
        queryClient.setQueryData(QUERY_KEYS.test(id), context.previousTest);
      }
      handleError(err);
    },
    onSuccess: (updatedTest) => {
      queryClient.setQueryData(QUERY_KEYS.test(id), updatedTest);
      handleSuccess('Test completed successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries(QUERY_KEYS.test(id));
      queryClient.invalidateQueries(QUERY_KEYS.testResults(id));
    },
  });
};

export const useAddVariant = (testId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVariantDTO) => abTestingService.addVariant(testId, data),
    onSuccess: (updatedTest) => {
      queryClient.setQueryData(QUERY_KEYS.test(testId), updatedTest);
      handleSuccess('Variant added successfully');
    },
    onError: handleError,
  });
};

export const useUpdateVariant = (testId: string, variantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVariantDTO) =>
      abTestingService.updateVariant(testId, variantId, data),
    onSuccess: (updatedTest) => {
      queryClient.setQueryData(QUERY_KEYS.test(testId), updatedTest);
      handleSuccess('Variant updated successfully');
    },
    onError: handleError,
  });
};

// Custom hook for monitoring test status and auto-completing when conditions are met
export const useTestStatus = (testId: string) => {
  const { data: test } = useABTest(testId);
  const { data: results } = useABTestResults(testId);
  const endTestMutation = useEndABTest(testId);

  useQuery({
    queryKey: ['test-status-check', testId],
    queryFn: () => abTestingService.checkTestStatus(testId),
    enabled: test?.status === 'running',
    refetchInterval: 60000, // Check every minute
    onSuccess: (data) => {
      if (data.should_end) {
        endTestMutation.mutate();
      }
    },
  });

  return {
    status: test?.status,
    results,
    isLoading: endTestMutation.isLoading,
  };
};
