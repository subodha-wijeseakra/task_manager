'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, passwordChangeSchema } from '@/lib/validations';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { updateProfile, changePassword } from '@/app/actions/user';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { MdPerson, MdLock } from 'react-icons/md';

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordChangeSchema>;

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    // Profile Form State
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password Form State
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setProfileValue,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordChangeSchema),
    });

    useEffect(() => {
        if (session?.user?.name) {
            setProfileValue('name', session.user.name);
        }
    }, [session, setProfileValue]);

    const onProfileSubmit = async (data: ProfileFormData) => {
        setProfileLoading(true);
        setProfileError(null);
        setProfileSuccess(null);

        const result = await updateProfile(data);

        if (result.error) {
            setProfileError(result.error);
        } else {
            setProfileSuccess('Profile updated successfully');
            await update({ name: data.name });
            router.refresh();
        }
        setProfileLoading(false);
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setPasswordLoading(true);
        setPasswordError(null);
        setPasswordSuccess(null);

        const result = await changePassword(data);

        if (result.error) {
            setPasswordError(result.error);
        } else {
            setPasswordSuccess('Password changed successfully');
            resetPasswordForm();
        }
        setPasswordLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-normal text-foreground">Settings</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={clsx(
                                "flex w-full items-center gap-3 rounded-r-full px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                                activeTab === 'profile'
                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                    : "text-muted-foreground"
                            )}
                        >
                            <MdPerson className="h-5 w-5" />
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={clsx(
                                "flex w-full items-center gap-3 rounded-r-full px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                                activeTab === 'security'
                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                    : "text-muted-foreground"
                            )}
                        >
                            <MdLock className="h-5 w-5" />
                            Security
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-normal text-foreground">Profile Information</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">Update your account's profile information and email address.</p>
                                </div>

                                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="max-w-xl space-y-6">
                                    {profileSuccess && (
                                        <div className="rounded-md bg-green-100 p-3 text-sm font-medium text-green-900 dark:bg-green-900 dark:text-green-100">
                                            {profileSuccess}
                                        </div>
                                    )}
                                    {profileError && (
                                        <div className="rounded-md bg-red-100 p-3 text-sm font-medium text-red-900 dark:bg-red-900 dark:text-red-100">
                                            {profileError}
                                        </div>
                                    )}

                                    <Input
                                        label="Name"
                                        type="text"
                                        placeholder="Your Name"
                                        error={profileErrors.name?.message}
                                        {...registerProfile('name')}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground">Email</label>
                                        <div className="mt-1 flex h-12 w-full items-center rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
                                            {session?.user?.email}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">Email addresses cannot be changed.</p>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" isLoading={profileLoading} className="rounded-full px-8 shadow-none hover:shadow-md">
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-normal text-foreground">Security</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>
                                </div>

                                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="max-w-xl space-y-6">
                                    {passwordSuccess && (
                                        <div className="rounded-md bg-green-100 p-3 text-sm font-medium text-green-900 dark:bg-green-900 dark:text-green-100">
                                            {passwordSuccess}
                                        </div>
                                    )}
                                    {passwordError && (
                                        <div className="rounded-md bg-red-100 p-3 text-sm font-medium text-red-900 dark:bg-red-900 dark:text-red-100">
                                            {passwordError}
                                        </div>
                                    )}

                                    <Input
                                        label="Current Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={passwordErrors.currentPassword?.message}
                                        {...registerPassword('currentPassword')}
                                    />

                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={passwordErrors.newPassword?.message}
                                        {...registerPassword('newPassword')}
                                    />

                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={passwordErrors.confirmNewPassword?.message}
                                        {...registerPassword('confirmNewPassword')}
                                    />

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" isLoading={passwordLoading} className="rounded-full px-8 shadow-none hover:shadow-md">
                                            Change Password
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
