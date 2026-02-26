import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
        console.log('Connected to', process.env.MONGODB_URI);
        const projects = await mongoose.connection.db.collection('projects').find({}).toArray();
        console.log(`Total projects found: ${projects.length}`);

        const counts = {};
        projects.forEach(p => {
            counts[p.status] = (counts[p.status] || 0) + 1;
        });
        console.log('Statuses:', counts);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkDb();
