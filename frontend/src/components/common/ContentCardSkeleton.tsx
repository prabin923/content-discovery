import Skeleton from './Skeleton';

export default function ContentCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <Skeleton className="mb-3 h-40 w-full" />
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="mb-2 h-5 w-full" />
      <Skeleton className="mb-4 h-12 w-full" />
      <Skeleton className="mt-auto h-8 w-20" />
    </div>
  );
}
