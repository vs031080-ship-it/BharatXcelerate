import { MongoClient } from 'mongodb';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';
const client = new MongoClient(URI);

async function fixQuestions() {
    try {
        await client.connect();
        const db = client.db();
        const questionsCollection = db.collection('questions');

        console.log("Fetching questions to fix...");
        const questions = await questionsCollection.find({}).toArray();
        let fixedCount = 0;

        for (const q of questions) {
            let changed = false;

            // Fix question text e.g. [ADVANCED v5] Which...
            const originalText = q.text;
            const newText = originalText.replace(/^\[(?:ADVANCED|BEGINNER|INTERMEDIATE) v\d+\]\s*/i, '');
            if (newText !== originalText) {
                q.text = newText;
                changed = true;
            }

            // Fix options text e.g. "... — option A"
            for (let i = 0; i < q.options.length; i++) {
                const originalOpt = q.options[i].text;
                const newOpt = originalOpt.replace(/\s*—\s*option [A-Z]/i, '');
                if (newOpt !== originalOpt) {
                    q.options[i].text = newOpt;
                    changed = true;
                }
            }

            if (changed) {
                await questionsCollection.updateOne(
                    { _id: q._id },
                    { $set: { text: q.text, options: q.options } }
                );
                fixedCount++;
            }
        }

        console.log(`Successfully fixed ${fixedCount} questions in the database.`);

    } catch (e) {
        console.error("Error fixing questions:", e);
    } finally {
        await client.close();
    }
}

fixQuestions();
