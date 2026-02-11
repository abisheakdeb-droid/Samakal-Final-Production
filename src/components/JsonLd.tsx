import { ArticleRow } from "@/types/database";

interface JsonLdProps {
  article: {
    title: string;
    slug: string;
    image?: string;
    author?: string; // string vs string[] in row, NewsItem has string
    date?: string; // display date
    // We might need raw dates for valid schema
    published_at?: string;
    updated_at?: string;
    category?: string;
    sub_headline?: string;
    [key: string]: any;
  };
}

export default function JsonLd({ article }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [
      article.image && article.image !== "/placeholder.svg"
        ? article.image
        : (process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com") +
          "/samakal-logo.png",
    ],
    datePublished: article.date || new Date().toISOString(), // Fallback
    dateModified: article.date || new Date().toISOString(),
    author: [
      {
        "@type": "Person",
        name: article.author || "Samakal Reporter",
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Samakal",
      logo: {
        "@type": "ImageObject",
        url:
          (process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com") +
          "/samakal-logo.png",
      },
    },
    // Optional: Add description if available, otherwise use a snippet
    description: article.sub_headline || `News about ${article.category}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com"}/article/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
