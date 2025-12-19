'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { clsx } from 'clsx';
import { RxAvatar, RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Tasks', href: '/tasks' },
    ];

    const isAuth = status === 'authenticated';

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="text-xl font-bold text-primary">
                                TaskManager
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {isAuth && navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                                        pathname === item.href
                                            ? 'border-primary text-foreground'
                                            : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <ThemeToggle />
                        {isAuth ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {session.user?.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    Sign out
                                </Button>
                            </div>
                        ) : (
                            <div className="space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Sign in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <RxCross2 className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <RxHamburgerMenu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 pb-3 pt-2">
                        {isAuth && navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                                    pathname === item.href
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-transparent text-muted-foreground hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {!isAuth && (
                            <>
                                <Link
                                    href="/login"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-muted-foreground hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-muted-foreground hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                    {isAuth && (
                        <div className="border-t border-gray-200 pb-3 pt-4">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    {session.user?.image ? (
                                        <img className="h-10 w-10 rounded-full" src={session.user.image} alt="" />
                                    ) : (
                                        <RxAvatar className="h-10 w-10 text-gray-400" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{session.user?.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Button
                                    variant="ghost"
                                    className="block w-full px-4 py-2 text-left text-base font-medium text-muted-foreground hover:bg-gray-100 hover:text-gray-800"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    Sign out
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
