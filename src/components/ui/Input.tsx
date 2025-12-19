'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className="relative w-full">
                <input
                    type={inputType}
                    className={cn(
                        'peer flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm text-foreground placeholder-transparent transition-all focus:border-2 focus:border-primary focus:outline-none',
                        error && 'border-destructive focus:border-destructive',
                        className
                    )}
                    placeholder={label || 'Input'}
                    ref={ref}
                    {...props}
                />
                {label && (
                    <label className="pointer-events-none absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary">
                        {label}
                    </label>
                )}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                        {showPassword ? (
                            <MdVisibilityOff className="h-5 w-5" />
                        ) : (
                            <MdVisibility className="h-5 w-5" />
                        )}
                    </button>
                )}
                {error && (
                    <p className="mt-1 text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
