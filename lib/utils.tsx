import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ButtonHTMLAttributes, ReactNode } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}