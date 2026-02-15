import { fetchArticlesBySearch } from "@/lib/actions-article";
import SearchSidebar from "@/components/SearchSidebar";
import SearchHero from "@/components/SearchHero";
import SearchZeroState from "@/components/SearchZeroState";
import SearchResults from "@/components/SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    date?: string;
    sort?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  const category = resolvedSearchParams.category || "all";
  const dateRange = resolvedSearchParams.date || "all";
  const sort = resolvedSearchParams.sort || "newest";

  const results = query
    ? await fetchArticlesBySearch({
      query,
      category,
      dateRange,
      sort,
      limit: 50,
    })
    : [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Sidebar (Sticky on Desktop) */}
        <div className="lg:col-span-1 hidden lg:block">
          <SearchSidebar />
        </div>

        {/* Right Column: Main Content */}
        <main className="lg:col-span-3">
          {/* Hero Search Bar */}
          <div className="mb-8">
            <SearchHero />
          </div>

          {/* Content Area */}
          {query ? (
            <SearchResults results={results} query={query} />
          ) : (
            <SearchZeroState />
          )}
        </main>
      </div>

      {/* Mobile Sidebar (Todo: Implement Drawer if needed, for now hidden on mobile as per common pattern or add a filter button) */}
      {/* For this iteration, basic responsiveness is handled by hiding sidebar on mobile. 
           Ideally we add a "Filter" button on mobile to open a drawer. 
      */}
    </div>
  );
}
