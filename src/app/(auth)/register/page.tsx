'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerUser } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);

        const result = await registerUser(data);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/login?registered=true');
        }
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 16; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setValue('password', password);
        setValue('confirmPassword', password);
        setPasswordStrength(5); // Max strength for generated
    };

    const watchPassword = watch('password');

    // Update strength when password changes
    useEffect(() => {
        if (watchPassword !== undefined) {
            let score = 0;
            if (watchPassword.length > 6) score++;
            if (watchPassword.match(/[a-z]/)) score++;
            if (watchPassword.match(/[A-Z]/)) score++;
            if (watchPassword.match(/[0-9]/)) score++;
            if (watchPassword.match(/[^a-zA-Z0-9]/)) score++;
            setPasswordStrength(score);
        } else {
            setPasswordStrength(0);
        }
    }, [watchPassword]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-[450px] space-y-8 rounded-xl border border-border bg-card p-10 shadow-sm sm:p-12">
                <div className="text-left">
                    <h2 className="text-2xl font-normal text-foreground">Create your TaskManager Account</h2>
                    <p className="mt-2 text-base text-muted-foreground">to continue to TaskManager</p>
                </div>

                <div className="mt-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="rounded-md bg-red-100 p-3 text-sm font-medium text-red-900 dark:bg-red-900 dark:text-red-100">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="john@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <Input
                                label="Confirm"
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />
                        </div>

                        {/* Password Strength Meter */}
                        <div className="space-y-2">
                            <div className="flex h-1 gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className={clsx(
                                            "h-full flex-1 rounded-full transition-colors duration-300",
                                            level <= passwordStrength
                                                ? passwordStrength < 3
                                                    ? "bg-red-500"
                                                    : passwordStrength < 5
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                : "bg-muted"
                                        )}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className={clsx(
                                    "font-medium transition-colors",
                                    passwordStrength < 3 ? "text-red-500" :
                                        passwordStrength < 5 ? "text-yellow-500" : "text-green-500"
                                )}>
                                    {passwordStrength === 0 ? "" :
                                        passwordStrength < 3 ? "Weak" :
                                            passwordStrength < 5 ? "Medium" : "Strong"}
                                </span>
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="font-medium text-primary hover:text-primary/80 hover:underline"
                                >
                                    Generate strong password
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/90 hover:underline">
                                Sign in instead
                            </Link>
                            <Button type="submit" className="rounded-full px-8 font-medium shadow-none hover:shadow-md" isLoading={loading}>
                                Next
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
