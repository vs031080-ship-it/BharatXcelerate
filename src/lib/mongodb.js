import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS for SRV lookups (fixes Atlas on restrictive networks)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatxcelerate';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = { bufferCommands: false };
        console.log('Connecting to MongoDB Atlas...');
        const start = Date.now();
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log(`MongoDB Connected in ${Date.now() - start}ms`);
            return mongoose;
        }).catch(err => {
            console.error('MongoDB Connection Error:', err);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
