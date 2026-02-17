const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

// Load environment variables
loadEnvConfig(cwd());

const bengaliArticles = [
  {
    title: 'ঢাকায় মেট্রোরেল সেবা সম্প্রসারণ',
    slug: 'dhaka-metrorail-expansion',
    content: `<h2>মেট্রোরেলের নতুন যুগ</h2>
<p>রাজধানীর যানজট নিরসনে মেট্রোরেল এখন আরও বেশি এলাকায় সেবা দিচ্ছে। উত্তরা থেকে মতিঝিল পর্যন্ত এখন নিরবচ্ছিন্ন যাত্রা সম্ভব।</p>
<p>প্রতিদিন লাখো যাত্রী এই সেবা নিচ্ছেন। ভাড়াও অত্যন্ত সাশ্রয়ী।</p>`,
    category: 'Dhaka',
    views: 15420
  },
  {
    title: 'জাতীয় নির্বাচন ২০২৬: প্রস্তুতি পুরোদমে',
    slug: 'national-election-2026-preparation',
    content: `<h2>নির্বাচনের প্রস্তুতি</h2>
<p>আগামী জাতীয় নির্বাচনের জন্য নির্বাচন কমিশন সব ধরনের প্রস্তুতি সম্পন্ন করছে।</p>
<p>দেশব্যাপী ভোটার তালিকা হালনাগাদ করা হয়েছে।</p>`,
    category: 'Politics',
    views: 28350
  },
  {
    title: 'বাংলাদেশ ক্রিকেট দল সিরিজ জয়ের পথে',
    slug: 'bangladesh-cricket-series-victory',
    content: `<h2>দুর্দান্ত পারফরম্যান্স</h2>
<p>শক্তিশালী প্রতিপক্ষের বিরুদ্ধে দুর্দান্ত খেলা দেখিয়ে সিরিজ জয়ের কাছাকাছি বাংলাদেশ দল।</p>
<p>তরুণ ক্রিকেটারদের অসাধারণ অবদান রয়েছে এই জয়ে।</p>`,
    category: 'Sports',
    views: 18720
  },
  {
    title: 'প্রযুক্তি খাতে বাংলাদেশের অগ্রগতি',
    slug: 'bangladesh-technology-sector-progress',
    content: `<h2>ডিজিটাল বাংলাদেশ</h2>
<p>প্রযুক্তি খাতে বাংলাদেশের অগ্রগতি এখন বিশ্বব্যাপী স্বীকৃত। আইটি সেক্টরে বিপুল কর্মসংস্থান সৃষ্টি হয়েছে।</p>
<p>স্টার্টআপগুলো দেশের অর্থনীতিতে গুরুত্বপূর্ণ ভূমিকা রাখছে।</p>`,
    category: 'Technology',
    views: 12890
  },
  {
    title: 'শিক্ষা ব্যবস্থায় নতুন সংস্কার',
    slug: 'education-system-new-reforms',
    content: `<h2>শিক্ষায় পরিবর্তন</h2>
<p>দেশের শিক্ষা ব্যবস্থায় বড় ধরনের সংস্কার আনা হচ্ছে। আধুনিক কারিকুলাম প্রণয়ন করা হয়েছে।</p>
<p>শিক্ষার্থীদের দক্ষতা বৃদ্ধিতে জোর দেওয়া হচ্ছে।</p>`,
    category: 'Education',
    views: 9540
  },
  {
    title: 'পদ্মা সেতুর অর্থনৈতিক প্রভাব',
    slug: 'padma-bridge-economic-impact',
    content: `<h2>স্বপ্নের পদ্মা সেতু</h2>
<p>পদ্মা সেতু চালু হওয়ার পর দক্ষিণাঞ্চলের অর্থনীতিতে বিপ্লব ঘটেছে। যোগাযোগ ব্যবস্থার উন্নতি হয়েছে।</p>
<p>ব্যবসা-বাণিজ্যে নতুন দিগন্ত খুলেছে।</p>`,
    category: 'Economy',
    views: 22150
  },
  {
    title: 'স্বাস্থ্য সেবায় ডিজিটাল উদ্যোগ',
    slug: 'digital-health-services-initiative',
    content: `<h2>টেলিমেডিসিন সেবা</h2>
<p>সারাদেশে টেলিমেডিসিন সেবা চালু করা হয়েছে। গ্রামীণ জনগোষ্ঠী এখন ঘরে বসে চিকিৎসা সেবা পাচ্ছে।</p>
<p>অনলাইনে ডাক্তারের পরামর্শ নেওয়া সম্ভব হচ্ছে।</p>`,
    category: 'Health',
    views: 7890
  },
  {
    title: 'রপ্তানি আয়ে নতুন রেকর্ড',
    slug: 'export-earnings-new-record',
    content: `<h2>অর্থনৈতিক সাফল্য</h2>
<p>গত অর্থবছরে বাংলাদেশের রপ্তানি আয় নতুন রেকর্ড সৃষ্টি করেছে। তৈরি পোশাক শিল্প এতে প্রধান ভূমিকা রেখেছে।</p>
<p>নতুন নতুন বাজার সৃষ্টি হয়েছে।</p>`,
    category: 'Economy',
    views: 14230
  },
  {
    title: 'পরিবেশ সংরক্ষণে নতুন পদক্ষেপ',
    slug: 'environment-conservation-new-steps',
    content: `<h2>সবুজ বাংলাদেশ</h2>
<p>পরিবেশ রক্ষায় সরকার নতুন নতুন পদক্ষেপ নিয়েছে। বৃক্ষরোপণ কর্মসূচি ব্যাপক হারে চলছে।</p>
<p>প্লাস্টিক ব্যবহার কমাতে জনসচেতনতা বাড়ানো হচ্ছে।</p>`,
    category: 'Environment',
    views: 6780
  },
  {
    title: 'নারী ক্ষমতায়নে বাংলাদেশ',
    slug: 'women-empowerment-bangladesh',
    content: `<h2>নারী উন্নয়ন</h2>
<p>নারী ক্ষমতায়নে বাংলাদেশ এগিয়ে যাচ্ছে। সব ক্ষেত্রে নারীদের অংশগ্রহণ বাড়ছে।</p>
<p>উদ্যোক্তা হিসেবেও নারীরা সফল হচ্ছেন।</p>`,
    category: 'Society',
    views: 11450
  }
];

async function seedBengaliArticles(client) {
  try {
    // Get admin user ID
    const users = await client.sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
    const authorId = users.rows[0]?.id;

    if (!authorId) {
      console.error('No admin user found. Please run seed-admin.js first.');
      return;
    }

    console.log('Seeding Bengali articles...');

    for (const article of bengaliArticles) {
      await client.sql`
        INSERT INTO articles (title, slug, content, status, category, views, author_id, image)
        VALUES (
          ${article.title},
          ${article.slug},
          ${article.content},
          'published',
          ${article.category},
          ${article.views},
          ${authorId},
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=2070'
        )
        ON CONFLICT (slug) DO NOTHING;
      `;
      console.log(`✓ ${article.title}`);
    }

    console.log(`\n✅ Seeded ${bengaliArticles.length} Bengali articles successfully!`);
  } catch (error) {
    console.error('Error seeding Bengali articles:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedBengaliArticles(client);
 await client.end();
}

main().catch((err) => {
  console.error('An error occurred:', err);
});
