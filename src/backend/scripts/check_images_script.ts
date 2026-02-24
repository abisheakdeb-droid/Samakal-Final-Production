
import fs from 'fs';
import path from 'path';

// Read mockNews.ts
const mockNewsPath = path.join(process.cwd(), 'src/data/mockNews.ts');
const content = fs.readFileSync(mockNewsPath, 'utf-8');

// Regex to find the IMAGES_DB object and its content
// We look for patterns like "ID", inside the array brackets
const imageIdRegex = /"([0-9]+-[a-f0-9]+)"/g;

const matches = [...content.matchAll(imageIdRegex)];
const uniqueIds = [...new Set(matches.map(m => m[1]))];

console.log(`Found ${uniqueIds.length} unique image IDs.`);

async function checkImage(id: string) {
    const url = `https://images.unsplash.com/photo-${id}?q=80&w=100&auto=format&fit=crop`;
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.status !== 200) {
            return { id, status: response.status };
        }
    } catch (error) {
        return { id, status: 'error' };
    }
    return null;
}

async function main() {
    console.log("Checking images...");
    const results = [];
    // Check in batches avoiding rate limits
    const batchSize = 10;
    for (let i = 0; i < uniqueIds.length; i += batchSize) {
        const batch = uniqueIds.slice(i, i + batchSize);
        const promises = batch.map(id => checkImage(id));
        const batchResults = await Promise.all(promises);
        results.push(...batchResults.filter(r => r !== null));
        process.stdout.write(`.`);
    }
    console.log("\nDone.");

    if (results.length > 0) {
        console.log("Broken IDs found:");
        results.forEach(r => console.log(`${r.id} (${r.status})`));
    } else {
        console.log("All IDs are valid!");
    }
}

main();
