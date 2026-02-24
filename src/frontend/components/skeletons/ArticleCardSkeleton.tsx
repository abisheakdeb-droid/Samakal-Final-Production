import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          {/* Image Skeleton */}
          <Skeleton className="aspect-video w-full" />
          
          {/* Content Skeleton */}
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
