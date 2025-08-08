import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ButtonHTMLAttributes, ReactNode } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface KawaiiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export function KawaiiButton({
                               children,
                               className,
                               variant = 'primary',
                               size = 'md',
                               icon,
                               ...props
                             }: KawaiiButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600 shadow-md',
    secondary: 'bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50',
    ghost: 'text-gray-600 hover:text-pink-600 hover:bg-pink-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
      <button
          className={cn(
        'rounded-full font-medium transition-all duration-200',
        'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center gap-2',
        variants[variant],
        sizes[size],
        className
  )}
  {...props}
>
  {icon && <span className="text-lg">{icon}</span>}
    {children}
    </button>
  );
  }