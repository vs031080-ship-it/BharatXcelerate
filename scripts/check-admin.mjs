import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';
const client = new MongoClient(URI);

async function check() {
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const admin = await users.findOne({ email: 'admin@bharatxcelerate.com' });
        if (!admin) {
            console.log('❌ Admin user NOT FOUND in Local DB');
            return;
        }

        console.log('✅ Admin user found:', admin.email);
        console.log('Role:', admin.role);
        console.log('Status:', admin.status);

        const isValid = await bcrypt.compare('Admin@123', admin.password);
        console.log('Password Hash Match (Admin@123):', isValid ? '✅ YES' : '❌ NO');

        // Let's also check the student just in case
        const student = await users.findOne({ email: 'student@bharatxcelerate.com' });
        if (student) {
            console.log('\n✅ Student found:', student.email);
            const sValid = await bcrypt.compare('Student@123', student.password);
            console.log('Password Hash Match (Student@123):', sValid ? '✅ YES' : '❌ NO');
        }

    } finally {
        await client.close();
    }
}

check();
