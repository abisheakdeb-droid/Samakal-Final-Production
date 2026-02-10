import { fetchArchiveArticles } from "@/lib/actions-article";
import ArchiveClient from "@/components/ArchiveClient";
import { Suspense } from "react";

export const metadata = {
  title: "Archive | Samakal",
  description: "Browse past news articles by date and category.",
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Default to today if not provided, or handle empty state in UI
  const from =
    resolvedSearchParams.from || new Date().toISOString().split("T")[0];
  const to = resolvedSearchParams.to || new Date().toISOString().split("T")[0];
  const category = resolvedSearchParams.category || "all";

  const articles = await fetchArchiveArticles({
    startDate: from,
    endDate: to,
    category: category,
    limit: 50,
  });

  return (
    <main className="min-h-screen bg-background text-foreground font-serif">
      <div className="pt-8">
        <Suspense
          fallback={<div className="text-center py-20">Loading...</div>}
        >
          <ArchiveClient
            initialStartDate={from}
            initialEndDate={to}
            articles={articles}
          />
        </Suspense>
      </div>
    </main>
  );
}
