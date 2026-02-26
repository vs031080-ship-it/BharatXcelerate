// Run: node scripts/create-admin.mjs
// Creates an admin user in the local MongoDB database

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';
const ADMIN = {
    name: 'Admin',
    email: 'admin@bharatxcelerate.com',
    password: 'Admin@123',
    role: 'admin',
    status: 'active',
};

const client = new MongoClient(URI);
try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const existing = await users.findOne({ email: ADMIN.email });
    if (existing) {
        console.log('✅ Admin already exists:', ADMIN.email);
    } else {
        const hashed = await bcrypt.hash(ADMIN.password, 10);
        await users.insertOne({
            ...ADMIN,
            password: hashed,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ Admin user created!');
    }

    // Also create a test student
    const studentEmail = 'student@bharatxcelerate.com';
    const existingStudent = await users.findOne({ email: studentEmail });
    if (existingStudent) {
        console.log('✅ Test student already exists:', studentEmail);
    } else {
        const hashed = await bcrypt.hash('Student@123', 10);
        await users.insertOne({
            name: 'Test Student',
            email: studentEmail,
            password: hashed,
            role: 'student',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ Test student created!');
    }

    console.log('\n📋 Login credentials:');
    console.log('  ADMIN  → admin@bharatxcelerate.com / Admin@123');
    console.log('  STUDENT → student@bharatxcelerate.com / Student@123');
} finally {
    await client.close();
}
