import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';
const client = new MongoClient(URI);

async function reset() {
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const hashed = await bcrypt.hash('Admin@123', 10);

        const result = await users.updateOne(
            { email: 'admin@bharatxcelerate.com' },
            { $set: { password: hashed, role: 'admin', status: 'active' } }
        );

        if (result.matchedCount > 0) {
            console.log('✅ Admin password forcefully reset to Admin@123');
        } else {
            console.log('❌ Admin not found to update (should not happen)');
        }
    } finally {
        await client.close();
    }
}

reset();
