const { createClient } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function updateNav() {
    const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
    await client.connect();

    const res = await client.query('SELECT navigation_menu FROM site_settings WHERE id = 1');
    let navPlan = res.rows[0]?.navigation_menu;

    if (!navPlan) {
        console.log('No navigation menu found in settings.');
        await client.end();
        return;
    }

    // Define items to move
    const itemsToMoveLabels = ['মতামত', 'আর্কাইভ'];
    const itemsToMove = navPlan.filter(item => itemsToMoveLabels.includes(item.label));

    // Remove from main list
    navPlan = navPlan.filter(item => !itemsToMoveLabels.includes(item.label));

    // Find "সব" or "আরও" menu
    const allMenu = navPlan.find(item => item.label === 'সব' || item.label === 'আরও');

    if (allMenu) {
        if (!allMenu.subItems) allMenu.subItems = [];

        // Check if they are already in subItems to avoid duplicates
        itemsToMove.forEach(newItem => {
            if (!allMenu.subItems.find(sub => sub.label === newItem.label)) {
                allMenu.subItems.push(newItem);
            }
        });
        console.log('Moved items to "All" sub-menu.');
    } else {
        console.log('Could not find "All" or "More" menu.');
    }

    // Update DB
    await client.query('UPDATE site_settings SET navigation_menu = $1 WHERE id = 1', [JSON.stringify(navPlan)]);
    console.log('Database updated successfully.');

    await client.end();
}

updateNav().catch(console.error);
