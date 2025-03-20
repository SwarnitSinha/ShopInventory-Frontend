import { useQuery } from '@tanstack/react-query';
import { Town } from '../types';

// Assuming you have a fetchTowns function defined somewhere
const fetchTowns = async (): Promise<Town[]> => {
  const response = await fetch('/api/towns');
  if (!response.ok) {
    throw new Error('Failed to fetch towns');
  }
  return response.json();
};

export const useTown = () => {
  const { data: towns, isLoading: townsLoading, error } = useQuery<Town[]>({
    queryKey: ['towns'],
    queryFn: fetchTowns,
  });

  return { towns, townsLoading, error };
};