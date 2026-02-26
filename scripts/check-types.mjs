import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';

async function check() {
    try {
        await mongoose.connect(URI);
        const TestPaper = mongoose.connection.collection('testpapers');
        const Question = mongoose.connection.collection('questions');

        const test = await TestPaper.findOne();
        console.log("Test category type:", typeof test.category, test.category);

        const count = await Question.countDocuments({ category: test.category, level: test.level });
        console.log("Count for this test exactly:", count);

        const allQuestions = await Question.find().limit(1).toArray();
        console.log("Question category type:", typeof allQuestions[0].category, allQuestions[0].category);

    } finally {
        await mongoose.disconnect();
    }
}
check();
