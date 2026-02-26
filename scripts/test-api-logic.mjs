import mongoose from 'mongoose';
import TestPaper from '../src/models/TestPaper.js';
import Question from '../src/models/Question.js';
import SkillCategory from '../src/models/SkillCategory.js';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';

async function test() {
    await mongoose.connect(URI);
    const testDoc = await TestPaper.findOne();
    console.log("Found test:", testDoc._id, "category:", testDoc.category, "level:", testDoc.level);

    const questions = await Question.find({ category: testDoc.category, level: testDoc.level }).limit(5);
    console.log("Found questions length without populate:", questions.length);

    // Now simulate what the API actually runs:
    const qCount = await Question.countDocuments({ category: testDoc.category, level: testDoc.level });
    console.log("Count without populate:", qCount);

    await mongoose.disconnect();
}
test();
