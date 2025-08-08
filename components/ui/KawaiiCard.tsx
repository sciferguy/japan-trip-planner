import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KawaiiCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'sakura' | 'ocean' | 'forest' | 'sunset';
    hasGlow?: boolean;
    onClick?: () => void;
}

export function KawaiiCard({
                               children,
                               className,
                               variant = 'sakura',
                               hasGlow = false,
                               onClick
                           }: KawaiiCardProps) {
    const variants = {
        sakura: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
        ocean: 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200',
        forest: 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200',
        sunset: 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200',
    };

    return (
        <div
            className={cn(
                'rounded-2xl border-2 p-4 shadow-sm transition-all duration-300',
                'hover:shadow-md hover:scale-[1.02]',
                variants[variant],
                hasGlow && 'shadow-lg shadow-pink-200/50',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}