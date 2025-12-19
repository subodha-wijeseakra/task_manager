import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          <span className="block">Take control of your</span>{' '}
          <span className="block text-primary">internship tasks</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground sm:text-x md:mt-8 md:max-w-3xl md:text-2xl">
          Organize, prioritize, and track your work with ease. The ultimate tool for students and interns to stay ahead.
        </p>
        <div className="mx-auto mt-10 max-w-md gap-4 sm:flex sm:justify-center md:mt-12">
          <Link href="/register">
            <Button size="lg" className="w-full rounded-full px-8 text-lg font-medium shadow-lg hover:shadow-xl sm:w-auto">
              Get started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="mt-3 w-full rounded-full px-8 text-lg font-medium shadow-sm sm:mt-0 sm:w-auto">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
