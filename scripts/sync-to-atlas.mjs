/**
 * sync-to-atlas.mjs
 * Syncs ALL local MongoDB data to MongoDB Atlas.
 * Uses dns.setServers to force 8.8.8.8 so SRV records resolve correctly.
 *
 * Run: node scripts/sync-to-atlas.mjs
 */

// Override DNS to use Google's 8.8.8.8 (local DNS can't resolve _mongodb._tcp SRV records)
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { MongoClient } from 'mongodb';

const LOCAL_URI = 'mongodb://localhost:27017/bharatxcelerate-local';
const ATLAS_URI = 'mongodb+srv://bharatxcelerate_dev_user:TsBqJ5BYXfhGFBLd@cluster0.ajkfhy9.mongodb.net/bharatxcelerate-dev?retryWrites=true&w=majority&appName=Cluster0';

// Collections to sync (in safe dependency order)
const COLLECTIONS = [
    'users',
    'skillcategories',
    'projects',
    'testpapers',
    'questions',
    'examsessions',
    'submissions',
    'scorecards',
    'ideas',
    'jobs',
    'applications',
    'notifications',
    'shortlists',
];

const localClient = new MongoClient(LOCAL_URI);
const atlasClient = new MongoClient(ATLAS_URI, { serverSelectionTimeoutMS: 60000 });

async function syncCollection(localDb, atlasDb, collectionName) {
    const localCol = localDb.collection(collectionName);
    const atlasCol = atlasDb.collection(collectionName);

    const localDocs = await localCol.find({}).toArray();

    if (localDocs.length === 0) {
        console.log(`  ⏭️  ${collectionName}: empty locally, skipping.`);
        return 0;
    }

    console.log(`  🔄 ${collectionName}: syncing ${localDocs.length} docs...`);

    // Use bulkWrite for speed
    const ops = localDocs.map(doc => ({
        replaceOne: {
            filter: { _id: doc._id },
            replacement: doc,
            upsert: true,
        }
    }));

    try {
        const result = await atlasCol.bulkWrite(ops, { ordered: false });
        const count = (result.upsertedCount || 0) + (result.modifiedCount || 0) + (result.matchedCount || 0);
        console.log(`  ✅ ${collectionName}: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);
        return localDocs.length;
    } catch (err) {
        console.error(`  ❌ ${collectionName}: bulkWrite failed: ${err.message}`);
        // Fall back to per-doc upsert
        let ok = 0;
        for (const doc of localDocs) {
            try {
                await atlasCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
                ok++;
            } catch (e) {
                console.error(`    ⚠️ doc ${doc._id}: ${e.message}`);
            }
        }
        console.log(`  ✅ ${collectionName}: ${ok}/${localDocs.length} synced (fallback mode)`);
        return ok;
    }
}

async function main() {
    console.log('🚀 Starting local → Atlas sync...\n');
    console.log('📡 DNS overridden to 8.8.8.8 for SRV resolution\n');

    try {
        await localClient.connect();
        console.log('✅ Connected to local MongoDB');
    } catch (err) {
        console.error('❌ Local connection failed:', err.message);
        process.exit(1);
    }

    try {
        await atlasClient.connect();
        console.log('✅ Connected to MongoDB Atlas\n');
    } catch (err) {
        console.error('❌ Atlas connection failed:', err.message);
        await localClient.close();
        process.exit(1);
    }

    const localDb = localClient.db();
    const atlasDb = atlasClient.db();

    // List what's actually in local
    const existingLocally = (await localDb.listCollections().toArray()).map(c => c.name);
    console.log(`📦 Local collections: ${existingLocally.join(', ')}\n`);

    let grandTotal = 0;

    // Sync known collections in order
    for (const col of COLLECTIONS) {
        if (!existingLocally.includes(col)) {
            console.log(`  ⚠️  ${col}: not found locally, skipping.`);
            continue;
        }
        grandTotal += await syncCollection(localDb, atlasDb, col);
    }

    // Sync any extra collections
    const extra = existingLocally.filter(c => !COLLECTIONS.includes(c));
    if (extra.length > 0) {
        console.log(`\n📋 Additional collections: ${extra.join(', ')}`);
        for (const col of extra) {
            grandTotal += await syncCollection(localDb, atlasDb, col);
        }
    }

    console.log(`\n🎉 Done! Total docs synced to Atlas: ${grandTotal}`);

    await Promise.all([localClient.close(), atlasClient.close()]);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
