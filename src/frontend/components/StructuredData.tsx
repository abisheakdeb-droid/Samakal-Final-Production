import Script from 'next/script';

interface NewsArticleSchema {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type: 'NewsArticle' | 'BreadcrumbList' | 'Organization';
  data: NewsArticleSchema | BreadcrumbItem[] | object;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema: object = {};

  if (type === 'NewsArticle') {
    const article = data as NewsArticleSchema;
    schema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.headline,
      description: article.description,
      image: article.image,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: article.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: article.publisher.logo,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url || 'https://samakal.com',
      },
    };
  } else if (type === 'BreadcrumbList') {
    const breadcrumbs = data as BreadcrumbItem[];
    schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  } else if (type === 'Organization') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'সমকাল',
      alternateName: 'Samakal',
      url: 'https://samakal.com',
      logo: 'https://samakal.com/samakal-logo.png',
      sameAs: [
        'https://www.facebook.com/samakal',
        'https://twitter.com/samakal',
        'https://www.youtube.com/samakal',
      ],
    };
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}
