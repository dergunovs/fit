import { vi } from 'vitest';

const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();
const mockApi = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };

const serviceMocks = {
  useQuery: mockUseQuery,
  useMutation: mockUseMutation,
  api: mockApi,

  get lastQuery() {
    return mockUseQuery.mock.calls[0]?.[0];
  },

  get lastMutation() {
    return mockUseMutation.mock.calls[0]?.[0];
  },

  query: {
    success: <T>(data: T) => mockUseQuery.mockReturnValue({ data, isLoading: false, isSuccess: true }),
  },

  mutation: {
    success: <T>(data: T) => mockUseMutation.mockReturnValue({ mutate: vi.fn(), data, isSuccess: true }),
  },

  http: {
    get: mockApi.get,
    post: mockApi.post,
    patch: mockApi.patch,
    delete: mockApi.delete,

    mockGet: <T>(data: T) => mockApi.get.mockResolvedValue({ data }),
    mockPost: <T>(data: T) => mockApi.post.mockResolvedValue({ data }),
    mockPatch: <T>(data: T) => mockApi.patch.mockResolvedValue({ data }),
    mockDelete: <T>(data: T) => mockApi.delete.mockResolvedValue({ data }),
  },
};

vi.mock('mhz-helpers', async () => ({
  ...(await vi.importActual('mhz-helpers')),
  useQuery: serviceMocks.useQuery,
  useMutation: serviceMocks.useMutation,
  api: serviceMocks.api,
}));

export { serviceMocks };
