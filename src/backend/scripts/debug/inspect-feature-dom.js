const puppeteer = require('puppeteer');

async function inspect() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const url = 'https://samakal.com/feature/article/330032/%E0%A6%AA%E0%A6%A6%E0%A6%BE%E0%A6%A4%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%B0-%E2%80%98%E0%A6%86%E0%A6%B2%E0%A6%BF%E0%A6%AC%E0%A6%BE%E0%A6%AC%E0%A6%BE-%E0%A6%93-%E0%A6%9A%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BF%E0%A6%B6-%E0%A6%9A%E0%A7%8B%E0%A6%B0%E2%80%99';
  
  try {
    console.log(`Visiting ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Log potential content containers
    const containers = await page.evaluate(() => {
      const candidates = [];
      document.querySelectorAll('div').forEach(div => {
        // If div has a lot of text, it might be the content
        if (div.innerText.length > 500) {
           candidates.push({
             tag: div.tagName,
             id: div.id,
             className: div.className,
             textSample: div.innerText.substring(0, 50)
           });
        }
      });
      return candidates;
    });
    
    console.log('Potential Content Containers:', JSON.stringify(containers, null, 2));
    
  } catch(e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

inspect();
