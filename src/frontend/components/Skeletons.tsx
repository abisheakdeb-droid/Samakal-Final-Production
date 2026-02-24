export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonArticle() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="h-3 bg-gray-200 rounded w-32 mb-6"></div>
      
      {/* Title */}
      <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
      
      {/* Author Meta */}
      <div className="flex items-center gap-4 border-t border-b border-gray-100 py-4 mb-8">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      {/* Featured Image */}
      <div className="aspect-video bg-gray-200 rounded-xl mb-8"></div>
      
      {/* Article Content */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}
