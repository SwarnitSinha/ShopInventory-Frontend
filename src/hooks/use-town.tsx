import { useQuery } from '@tanstack/react-query';
import { Town } from '../types';
import { apiRequest } from '../lib/queryClient';

// Assuming you have a fetchTowns function defined somewhere
const fetchTowns = async (): Promise<Town[]> => {
  const response = await apiRequest("GET",'/api/towns');
  if (!response.ok) {
    throw new Error('Failed to fetch towns');
  }
  const data = await response.json();
  return data;
};

export const useTown = () => {
  const { data: towns, isLoading: townsLoading, error } = useQuery<Town[]>({
    queryKey: ['towns'],
    queryFn: fetchTowns,
  });

  return { towns, townsLoading, error };
};