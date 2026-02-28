import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import puppeteer from 'puppeteer';

loadEnvConfig(cwd());

async function testImprovedScraper() {
  console.log('🧪 Testing Samakal scraper with correct selectors...\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  
  try {
    const testUrl = 'https://samakal.com/bangladesh/article/335904/গণভোটে-সরকারি-কর্মকর্তারা-হ্যাঁ-বা-না-এর-পক্ষে-প্রচার-চালাতে-পারবেন-না-ইসি';
    
    console.log(`📖 Loading article...\n`);
    
    const page = await browser.newPage();
    await page.goto(testUrl, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });
    
    console.log('✅ Page loaded\n');
    console.log('🔍 Extracting content with Samakal selectors...\n');
    
    const data = await page.evaluate(() => {
      // Title
      const h1 = document.querySelector('h1');
      const title = h1 ? h1.textContent.trim() : '';
      
      // Content - Samakal specific #contentDetails.dNewsDesc
      const contentDiv = document.querySelector('#contentDetails.dNewsDesc');
      const content = contentDiv && contentDiv.innerHTML ? contentDiv.innerHTML.length : 0;
      
      // Image - og:image or div.DNewsImg img
      let imageUrl = '';
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        imageUrl = ogImage.getAttribute('content');
      } else {
        const img = document.querySelector('div.DNewsImg img, article img');
        imageUrl = img ? img.src : '';
      }
      
      return { title, content, imageUrl };
    });
    
    console.log('📊 Extraction Results:');
    console.log(`   ✅ Title: ${data.title.substring(0, 60)}...`);
    console.log(`   ✅ Content: ${data.content} characters`);
    console.log(`   ✅ Image: ${data.imageUrl.substring(0, 60)}...`);
    
    if (data.title && data.content > 500 && data.imageUrl) {
      console.log(`\n✅ ✅ ✅ TEST PASSED - All data extracted successfully!`);
      console.log(`\n🚀 🚀 🚀 Ready to run full import from Samakal.com`);
    } else {
      console.log(`\n⚠️  TEST FAILED - Missing or insufficient data`);
      if (!data.title) console.log('   ❌ Title missing');
      if (data.content < 500) console.log(`   ❌ Content too short: ${data.content} chars`);
      if (!data.imageUrl) console.log('   ❌ Image missing');
    }
    
    await page.close();
  } catch {
    console.error(`\n❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testImprovedScraper();
