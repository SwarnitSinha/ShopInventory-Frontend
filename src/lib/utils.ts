import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path: string) => {
  let baseUrl = import.meta.env.VITE_API_BASE_URL;
  let urlForImg = baseUrl.replace('/api', '');
  console.log("IMAGE URL::: ", urlForImg+path);
  return `${urlForImg}${path}`;
};