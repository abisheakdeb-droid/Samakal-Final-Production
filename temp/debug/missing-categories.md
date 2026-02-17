# পাওয়া যায়নি এমন ক্যাটাগরির তালিকা

## সফলভাবে Import হয়েছে (৮১টি আর্টিকেল):

1. ✅ **Bangladesh** - 15 articles
2. ✅ **Politics** - 15 articles
3. ✅ **Sports** - 15 articles
4. ✅ **Entertainment** - 15 articles
5. ✅ **International** - 15 articles
6. ✅ **অর্থনীতি (Economics)** - 6 articles

---

## পাওয়া যায়নি বা সমস্যা হয়েছে:

### 1. **Opinion (মতামত)**

- **URL:** https://samakal.com/opinion
- **অবস্থা:** ⚠️ Database connection timeout এর কারণে import শুরু হয়নি
- **সমাধান:** URL সঠিক আছে, পরে আবার চেষ্টা করা যাবে

### 2. **Feature**

- **URL:** https://samakal.com/feature
- **অবস্থা:** ❌ কোন article link পাওয়া যায়নি
- **কারণ:** Category page এ শুধু subcategory links আছে, article links নেই
- **সম্ভাব্য সমাধান:** Subcategory URL গুলো manually দেখতে হবে

### 3. **Samagra (সমগ্র)**

- **URL:** https://samakal.com/samagra
- **অবস্থা:** ❌ কোন article link পাওয়া যায়নি
- **কারণ:** এই category তে article structure ভিন্ন হতে পারে
- **সম্ভাব্য সমাধান:** URL pattern check করতে হবে

### 4. **Literature (সাহিত্য)**

- **URL:** https://samakal.com/sahitya
- **অবস্থা:** ❌ কোন article link পাওয়া যায়নি
- **কারণ:** Category page structure ভিন্ন
- **সম্ভাব্য সমাধান:** সাহিত্য section এর জন্য আলাদা scraping logic দরকার

---

## প্রযুক্তিগত সমস্যা:

### Database Connection Timeout

- **সমস্যা:** Vercel Postgres WebSocket connection automatically disconnect হয়ে যাচ্ছে long-running scripts এ
- **প্রভাব:** অর্থনীতি তে ৬টি article import এর পরেই timeout
- **সমাধান প্রচেষ্টা:** প্রতিটি article এর জন্য fresh connection তৈরি করা হয়েছে, কিন্তু তবুও timeout হচ্ছে

---

## সারাংশ:

**মোট import:** 81 articles  
**সফল categories:** 6টি  
**অসম্পূর্ণ:** Opinion (শুরু হয়নি)  
**ব্যর্থ:** Feature, Samagra, Literature (URL pattern issue)

---

## পরবর্তী পদক্ষেপ:

1. **Opinion category:** আবার import চেষ্টা করা (URL সঠিক আছে)
2. **অর্থনীতি:** আরও articles import করা (শুধু 6টি হয়েছে, লক্ষ্য 15+)
3. **Feature/Samagra/Literature:** এই categories এর সঠিক URL pattern খুঁজে বের করা
4. **Database timeout:** Smaller batches এ import করা বা alternative approach ব্যবহার করা
