import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MdPerson, MdEmail, MdSecurity, MdLogout } from 'react-icons/md';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const { user } = session;

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col items-center sm:flex-row">
                        <div className="mb-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 sm:mb-0">
                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || 'User'}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                    <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div className="sm:ml-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                            <div className="mt-2 flex items-center">
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                                    {(user as any).role || 'Student'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.name}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.email}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{(user as any).role || 'student'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</dt>
                                <dd className="mt-1 truncate text-sm text-gray-900 dark:text-white">{(user as any).id}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                {/* Logout Button not needed implicitly as it's in Navbar, but maybe nice here too */}
            </div>
        </div>
    );
}
