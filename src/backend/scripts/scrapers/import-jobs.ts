
import { sql } from '../../src/lib/db';
import { randomUUID } from 'crypto';

const JOBS_DATA = [
  {
    "title": "৫০তম বিসিএস প্রিলির ফল প্রকাশ, উত্তীর্ণ ১২৩৮৫",
    "image": "https://samakal.com/media/imgAll/2026February/2-1770721047.jpg",
    "date": "2026-02-10 16:57:00"
  },
  {
    "title": "৬৭ হাজার শিক্ষক নিয়োগের বিজ্ঞপ্তি প্রকাশ, আবেদন শুরু ১০ জানুয়ারি",
    "image": "https://samakal.com/media/imgAll/2026January/SM/9-1767650077.jpg",
    "date": "2026-01-06 03:54:00"
  },
  {
    "title": "প্রাথমিকের সহকারী শিক্ষক নিয়োগ পরীক্ষা হবে ৯ জানুয়ারি বিকেলে",
    "image": "https://samakal.com/media/imgAll/2026January/SM/3-1767528221.jpg",
    "date": "2026-01-04 18:03:00"
  },
  {
    "title": "৪৬তম বিসিএসের মৌখিক পরীক্ষার সময়সূচি প্রকাশ",
    "image": "https://samakal.com/media/imgAll/2025December/SM/psc-1766586556.jpg",
    "date": "2025-12-24 20:29:00"
  },
  {
    "title": "অস্টসিডিসির ‘থার্ড ন্যাশনাল জব ফেয়ার’ অনুষ্ঠিত",
    "image": "https://samakal.com/media/imgAll/2025December/SM/aust-carreer-1766559442.jpg",
    "date": "2025-12-24 12:57:00"
  },
  {
    "title": "ডাক ও টেলিযোগাযোগ বিভাগের শনিবারের নিয়োগ পরীক্ষা স্থগিত",
    "image": "https://samakal.com/media/imgAll/2025December/SM/samkal-023-1766150765.jpg",
    "date": "2025-12-19 19:26:00"
  },
  {
    "title": "বেঙ্গল কমার্শিয়াল ব্যাংকে নিয়োগ বিজ্ঞপ্তি প্রকাশ, আবেদন শেষ ২৬ নভেম্বর",
    "image": "https://samakal.com/media/imgAll/2025November/SM/011-1763627780.jpg",
    "date": "2025-11-20 14:36:00"
  },
  {
    "title": "এক্সিকিউটিভ পদে নিয়োগ দেবে বম্বে সুইটস",
    "image": "https://samakal.com/media/imgAll/2025October/SM/bombay-1761464964.jpg",
    "date": "2025-10-26 13:49:00"
  },
  {
    "title": "কাস্টমস, এক্সাইজ ও ভ্যাট কমিশনারেটে নিয়োগ বিজ্ঞপ্তি প্রকাশ,পদসংখ্যা ৯৯",
    "image": "https://samakal.com/media/imgAll/2025October/SM/job-1761464117.jpg",
    "date": "2025-10-26 13:50:00"
  },
  {
    "title": "৪৯তম বিসিএস পরীক্ষা আজ",
    "image": "https://samakal.com/media/imgAll/2025October/SM/psc-1760061152.png",
    "date": "2025-10-10 07:52:00"
  },
  {
    "title": "৪৭তম বিসিএস প্রিলিমিনারির ফল প্রকাশ, উত্তীর্ণ ১০৬৪৪ প্রার্থী",
    "image": "https://samakal.com/media/imgAll/2025September/SM/psc-1759079368.jpg",
    "date": "2025-09-28 23:16:00"
  },
  {
    "title": "৪৭তম বিসিএস প্রিলিমিনারি পরীক্ষা শুরু, ৩ লাখ ৭৪ হাজারের বেশি আবেদনকারী",
    "image": "https://samakal.com/media/imgAll/2025September/SM/chakri-1758257718.jpg",
    "date": "2025-09-19 10:55:00"
  },
  {
    "title": "উৎসাহ ও উদ্দীপনার মধ্য দিয়ে অনুষ্ঠিত হলো ‘জব ফেয়ার-২০২৫’",
    "image": "https://samakal.com/media/imgAll/2025September/SM/job-fair-ty-1758012031.jpg",
    "date": "2025-09-16 14:40:00"
  },
  {
    "title": "পাসপোর্ট অফিসে চাকরি, পদ সংখ্যা ২৭",
    "image": "https://samakal.com/media/imgAll/2025September/SM/job1-1757325071.jpg",
    "date": "2025-09-08 15:51:00"
  },
  {
    "title": "এইচএসসি পাসে ২ হাজার এএসআই নেবে সরকার",
    "image": "https://samakal.com/media/imgAll/2025September/SM/police-new-1756892179.jpg",
    "date": "2025-09-03 15:59:00"
  },
  {
    "title": "ল্যাবএইড হাসপাতাল নিয়োগ বিজ্ঞপ্তি প্রকাশ",
    "image": "https://samakal.com/media/imgAll/2025September/SM/job-1756802217.jpg",
    "date": "2025-09-02 14:36:00"
  },
  {
    "title": "মেট্রোরেলে নিয়োগ, পদ সংখ্যা ১৫",
    "image": "https://samakal.com/media/imgAll/2025September/SM/metro-1756724416.gif",
    "date": "2025-09-01 17:00:00"
  },
  {
    "title": "স্কয়ার গ্রুপে চাকরির সার্কুলার",
    "image": "https://samakal.com/media/imgAll/2025September/SM/job-1756721142.jpg",
    "date": "2025-09-01 16:05:00"
  },
  {
    "title": "প্রাথমিকে শিগগির শিক্ষক নিয়োগের বড় বিজ্ঞপ্তি",
    "image": "https://samakal.com/media/imgAll/2025September/SM/prathomik-1756674902.jpg",
    "date": "2025-09-01 03:15:00"
  },
  {
    "title": "সহকারী উপজেলা শিক্ষা কর্মকর্তা পদে নিয়োগ পরীক্ষা স্থগিত",
    "image": "https://samakal.com/media/imgAll/2025August/SM/primary-1756297738.gif",
    "date": "2025-08-27 18:28:00"
  }
];

async function main() {
  console.log('Starting job import...');

  // 1. Get an author ID
  const userResult = await sql`SELECT id FROM users LIMIT 1`;
  const authorId = userResult.rows[0]?.id;

  if (!authorId) {
    console.error('No users found to assign as author.');
    process.exit(1);
  }

  console.log(`Assigning to author ID: ${authorId}`);

  let count = 0;
  for (const job of JOBS_DATA) {
    const id = randomUUID();
    // Create a unique slug by appending a random string or timestamp to ensure uniqueness
    // Since Bangla slugification is tricky without a library, we'll use a simple timestamp suffix
    const slug = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Use the scraped date, defaulting to now if parsing fails (though format looks uniform)
    // The format is roughly "YYYY-MM-DD HH:mm:ss" which Postgres should handle or we pass as string

    try {
      await sql`
        INSERT INTO articles (
          id, title, slug, content, category, 
          status, author_id, image, published_at, 
          news_type, views
        ) VALUES (
          ${id}, 
          ${job.title}, 
          ${slug}, 
          ${`<p>${job.title}</p><p>বিস্তারিত আসছে...</p>`}, 
          'চাকরি', 
          'published', 
          ${authorId}, 
          ${job.image}, 
          ${job.date}, 
          'regular',
          ${Math.floor(Math.random() * 5000)}
        )
      `;
      console.log(`Inserted: ${job.title}`);
      count++;
    } catch (err) {
      console.error(`Failed to insert ${job.title}:`, err);
    }
  }

  console.log(`\nSuccess! Imported ${count} job articles.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
