const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');

loadEnvConfig(cwd());

async function debug() {
  try {
    const url = 'https://samakal.com/rss.xml';
    console.log('Fetching ' + url);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Content Type:', res.headers.get('content-type'));
    console.log('First 500 chars:');
    console.log(text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}

debug();
