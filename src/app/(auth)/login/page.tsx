'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';


type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const registered = searchParams.get('registered');
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const urlError = searchParams.get('error');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
                callbackUrl,
            });

            if (result?.error) {
                setError(result.error);
                setLoading(false);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-[450px] space-y-8 rounded-xl border border-border bg-card p-10 shadow-sm sm:p-12">
                <div className="text-center">
                    <h2 className="text-2xl font-normal text-foreground">Sign in</h2>
                    <p className="mt-2 text-base text-muted-foreground">to continue to TaskManager</p>
                </div>

                <div className="mt-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {registered && (
                            <div className="rounded-md bg-green-100 p-3 text-sm font-medium text-green-900 dark:bg-green-900 dark:text-green-100">
                                Account created successfully! Please log in.
                            </div>
                        )}

                        {urlError && !error && (
                            <div className="rounded-md bg-red-100 p-3 text-sm font-medium text-red-900 dark:bg-red-900 dark:text-red-100">
                                Authentication failed. Please try again.
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-100 p-3 text-sm font-medium text-red-900 dark:bg-red-900 dark:text-red-100">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Email or phone"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex items-center justify-between pt-4">
                            <Link href="/register" className="text-sm font-medium text-primary hover:text-primary/90 hover:underline">
                                Create account
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
