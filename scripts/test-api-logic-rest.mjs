import mongoose from 'mongoose';
import TestPaper from '../src/models/TestPaper.js';
import Question from '../src/models/Question.js';
import SkillCategory from '../src/models/SkillCategory.js';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';

async function test() {
    await mongoose.connect(URI);

    // Find "advanced" test for "REST APIs"
    const cat = await SkillCategory.findOne({ name: 'REST APIs' });
    if (!cat) {
        console.log("No REST APIs category");
        return;
    }

    const testDoc = await TestPaper.findOne({ category: cat._id, level: 'advanced' });
    if (!testDoc) {
        console.log("No REST APIs advanced test paper");
        return;
    }

    console.log("Target TestPaper _id:", testDoc._id);
    console.log("Target TestPaper level:", testDoc.level);

    const questions = await Question.find({ category: testDoc.category, level: testDoc.level }).limit(5);
    console.log("Array length fetched by Question.find:", questions.length);

    const qCount = await Question.countDocuments({ category: testDoc.category, level: testDoc.level });
    console.log("Question.countDocuments:", qCount);

    await mongoose.disconnect();
}
test();
