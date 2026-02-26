import { MongoClient } from 'mongodb';

const URI = 'mongodb://localhost:27017/bharatxcelerate-local';
const client = new MongoClient(URI);

const SKILL_DATA = {
    'python': {
        keywords: ['lists', 'dictionaries', 'tuples', 'sets', 'decorators', 'generators', 'list comprehensions', 'lambda functions', 'asyncio', 'pandas', 'numpy', 'virtualenv', 'pip', 'django', 'flask', 'classes', 'inheritance', 'polymorphism', 'dunder methods', 'GIL (Global Interpreter Lock)'],
        actions: ['store multiple items', 'map keys to values', 'store immutable sequences', 'ensure unique elements', 'modify function behavior', 'yield values lazily', 'create lists concisely', 'create anonymous functions', 'handle asynchronous I/O', 'manipulate dataframes', 'perform complex math', 'isolate dependencies', 'install packages', 'build web apps', 'create APIs', 'define object blueprints', 'inherit properties', 'override methods', 'implement operator overloading', 'prevent multi-threading anomalies']
    },
    'react': {
        keywords: ['useState', 'useEffect', 'useContext', 'useMemo', 'useCallback', 'useRef', 'Virtual DOM', 'JSX', 'Props', 'State', 'Redux', 'Context API', 'React Router', 'Higher-Order Components', 'Custom Hooks', 'React Suspense', 'Server Components', 'Next.js', 'Error Boundaries', 'Portals'],
        actions: ['manage local state', 'handle side effects', 'consume global state', 'memoize values', 'memoize functions', 'access DOM nodes directly', 'optimize rendering performance', 'write HTML in JavaScript', 'pass data between components', 'hold mutable data', 'manage complex global state', 'avoid prop drilling', 'handle client-side routing', 'reuse component logic', 'extract stateful logic', 'lazy load components', 'render on the server', 'build React frameworks', 'catch rendering errors', 'render children outside the DOM hierarchy']
    },
    'nodejs': {
        keywords: ['Event Loop', 'EventEmitter', 'Streams', 'Buffers', 'fs module', 'path module', 'child_process', 'cluster module', 'Express.js', 'Middleware', 'Passport.js', 'JWT', 'Socket.io', 'Mongoose', 'NPM', 'package.json', 'process.env', 'Require/Import', 'V8 Engine', 'libuv'],
        actions: ['handle asynchronous callbacks', 'trigger and listen to events', 'handle large data continuously', 'manipulate binary data', 'interact with the file system', 'manipulate file paths', 'spawn external scripts', 'utilize multi-core systems', 'create web servers easily', 'intercept HTTP requests', 'handle user authentication', 'issue stateless tokens', 'enable real-time communication', 'model MongoDB data', 'manage project dependencies', 'store project metadata', 'access environment variables', 'include external modules', 'compile JavaScript to machine code', 'provide the asynchronous I/O pool']
    },
    'sql': {
        keywords: ['SELECT', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'WHERE', 'INDEX', 'Foreign Key', 'Primary Key', 'Stored Procedure', 'Trigger', 'View', 'Common Table Expression (CTE)', 'Window Functions', 'UNION', 'Transactions (ACID)', 'Normalization', 'Denormalization', 'B-Tree', 'Execution Plan'],
        actions: ['retrieve data from tables', 'combine rows from multiple tables', 'aggregate data by column', 'sort result sets', 'filter aggregated results', 'filter rows before aggregation', 'speed up data retrieval', 'enforce referential integrity', 'uniquely identify rows', 'encapsulate reusable logic', 'auto-execute on data changes', 'create virtual tables', 'simplify complex subqueries', 'perform calculations across row sets', 'combine result sets vertically', 'ensure data reliability', 'reduce data redundancy', 'optimize read performance', 'structure database indexes', 'analyze query performance']
    },
    'java': {
        keywords: ['JVM', 'Garbage Collection', 'Interfaces', 'Abstract Classes', 'Multithreading', 'Synchronization', 'Collections Framework', 'HashMap', 'ArrayList', 'Streams API', 'Lambdas', 'Generics', 'Spring Boot', 'JPA/Hibernate', 'Maven/Gradle', 'Exceptions', 'Annotations', 'Reflection', 'Enums', 'JDBC'],
        actions: ['execute Java bytecode', 'automatically free memory', 'define contracts for classes', 'provide partial implementations', 'run tasks concurrently', 'prevent thread interference', 'manage groups of objects', 'store key-value pairs efficiently', 'store dynamic arrays', 'process sequences of elements', 'write concise functional code', 'ensure type safety', 'create standalone web apps', 'map objects to relational tables', 'manage dependencies and builds', 'handle runtime errors properly', 'add metadata to code', 'inspect classes at runtime', 'define fixed sets of constants', 'connect to relational databases']
    },
    'aws': {
        keywords: ['EC2', 'S3', 'Lambda', 'RDS', 'DynamoDB', 'VPC', 'CloudFront', 'Route 53', 'IAM', 'CloudWatch', 'SNS', 'SQS', 'Elastic Beanstalk', 'ECS', 'EKS', 'CloudFormation', 'Sagemaker', 'Kinesis', 'Redshift', 'API Gateway'],
        actions: ['provision virtual servers', 'store objects reliably', 'run serverless code', 'manage relational databases', 'manage NoSQL databases', 'isolate network resources', 'deliver content globally (CDN)', 'manage DNS routing', 'control access permissions', 'monitor resource health', 'send push notifications', 'queue messages', 'deploy web apps easily', 'run Docker containers', 'manage Kubernetes clusters', 'provision infrastructure as code', 'build machine learning models', 'process real-time data streams', 'warehouse large datasets', 'create REST APIs']
    },
    'docker': {
        keywords: ['Dockerfile', 'Images', 'Containers', 'Volumes', 'Docker Compose', 'Docker Swarm', 'Docker Hub', 'BuildKit', 'Network Bridge', 'ENTRYPOINT', 'CMD', 'EXPOSE', 'COPY/ADD', 'Multi-stage builds', 'Containers vs VMs', 'cgroups', 'namespaces', 'Docker Daemon', 'Alpine Linux', 'Host Network'],
        actions: ['define container blueprints', 'store packaged applications', 'run isolated application instances', 'persist data securely', 'manage multi-container apps', 'orchestrate container clusters', 'host public container images', 'accelerate image builds', 'connect containers locally', 'define the main executable', 'provide default arguments', 'document listening ports', 'transfer files into the image', 'reduce final image size', 'reduce overhead', 'limit resource usage', 'isolate process trees', 'manage container lifecycles', 'provide a minimal base OS', 'share the host network stack']
    },
    'html-css': {
        keywords: ['Flexbox', 'CSS Grid', 'Media Queries', 'Semantic HTML', 'Accessibility (a11y)', 'Z-index', 'Box Model', 'Specificity', 'Pseudo-classes', 'CSS Variables', 'Animations/Transitions', 'SVG', 'Responsive Design', 'BEM Methodology', 'SASS/SCSS', 'Positioning', 'Typography', 'Forms', 'Cookies/Local Storage', 'Browser Rendering'],
        actions: ['align items purely in 1D', 'create complex 2D layouts', 'apply styles conditionally by screen size', 'improve SEO and reader support', 'ensure usability for all users', 'control stacking order', 'calculate element dimensions', 'determine which style rule wins', 'style elements based on state', 'store reusable CSS values', 'create smooth visual changes', 'render scalable vector graphics', 'adapt layouts to any device', 'name classes predictably', 'write maintainable CSS', 'place elements exactly', 'style text beautifully', 'collect user input', 'store client-side data', 'paint pixels to the screen']
    },
    'git': {
        keywords: ['Commit', 'Branch', 'Merge', 'Rebase', 'Pull Request', 'Fetch vs Pull', 'Stash', 'Cherry-pick', 'Reset', 'Revert', 'Git Flow', 'Remote', 'Tag', 'Reflog', 'gitignore', 'Submodules', 'Conflict Resolution', 'Squash', 'HEAD', 'Index/Staging Area'],
        actions: ['save a snapshot of changes', 'isolate a line of development', 'combine multiple histories', 'rewrite commit histories linearly', 'propose changes to a repository', 'update local tracking branches', 'temporarily hide modified tracked files', 'apply a specific commit from elsewhere', 'move HEAD to a specific commit', 'create a new commit undoing changes', 'manage release branches', 'link to a server repository', 'mark specific release points', 'recover lost commits', 'exclude files from tracking', 'embed external repositories', 'fix overlapping code changes', 'combine multiple commits into one', 'point to the current branch', 'prepare files for the next commit']
    },
    'go': {
        keywords: ['Goroutines', 'Channels', 'Interfaces', 'Structs', 'Pointers', 'Defer', 'Panic/Recover', 'Garbage Collector', 'Go Modules', 'Context', 'Mutex', 'Select statement', 'Slice vs Array', 'Maps', 'Testing package', 'io.Reader/Writer', 'CGO', 'Type Assertion', 'WaitGroups', 'HTTP Handlers'],
        actions: ['run lightweight concurrent tasks', 'communicate safely between goroutines', 'define implicit behavior contracts', 'group related data fields', 'reference memory addresses', 'schedule functions to run at exit', 'handle unexpected runtime stops', 'manage memory automatically', 'handle package dependencies', 'manage request cancellation/timeouts', 'lock shared memory spaces', 'multiplex channel operations', 'handle dynamic lists of data', 'store key-value pairs', 'write unit tests built-in', 'stream bytes efficiently', 'call C code from Go', 'extract underlying interface values', 'wait for a collection of goroutines', 'process web requests']
    },
};

const TEMPLATES = [
    {
        q: "What is the primary purpose of {keyword} in {skill}?",
        correct: "To {action_correct}.",
        wrongs: ["To {action_wrong1}.", "To {action_wrong2}.", "To {action_wrong3}."]
    },
    {
        q: "Which scenario best describes when you should use {keyword}?",
        correct: "When you need to {action_correct}.",
        wrongs: ["When you need to {action_wrong1}.", "When you need to {action_wrong2}.", "When you need to {action_wrong3}."]
    },
    {
        q: "A developer is writing a {level} level {skill} application and wants to {action_correct}. What should they use?",
        correct: "{keyword}",
        wrongs: ["{keyword_wrong1}", "{keyword_wrong2}", "{keyword_wrong3}"]
    },
    {
        q: "In {skill}, if you use {keyword} correctly, you are primarily aiming to:",
        correct: "{action_correct}",
        wrongs: ["{action_wrong1}", "{action_wrong2}", "{action_wrong3}"]
    },
    {
        q: "Which of the following describes a key capability of {keyword}?",
        correct: "It is designed to {action_correct}.",
        wrongs: ["It is designed to {action_wrong1}.", "It is designed to {action_wrong2}.", "It is designed to {action_wrong3}."]
    }
];

function getRandomIndexes(max, count, exclude = -1) {
    const set = new Set();
    while (set.size < count) {
        let r = Math.floor(Math.random() * max);
        if (r !== exclude) set.add(r);
    }
    return Array.from(set);
}

function generateOptions(correctText, wrongTexts) {
    let opts = [
        { text: correctText, isCorrect: true },
        ...wrongTexts.map(t => ({ text: t, isCorrect: false }))
    ];
    // Shuffle options
    opts.sort(() => Math.random() - 0.5);
    return opts;
}

// Ensure the first letter is capitalized
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function generateQuestions() {
    try {
        await client.connect();
        const db = client.db();

        console.log("Fetching existing tests...");
        const tests = await db.collection('testpapers').find().toArray();
        if (tests.length === 0) {
            console.log("❌ No tests found in database!");
            return;
        }

        const categories = await db.collection('skillcategories').find().toArray();
        const categoryMap = {};
        categories.forEach(c => categoryMap[c._id.toString()] = c);

        console.log(`Found ${tests.length} tests. Generating ~100 questions per test...`);
        let totalInserted = 0;

        for (const test of tests) {
            const catInfo = categoryMap[test.category.toString()];
            if (!catInfo) continue;

            const skillSlug = catInfo.slug.toLowerCase();
            const level = test.level;

            // Map skill slug to our data dictionary (defaulting to python if missing just so it doesn't crash)
            let dataKey = skillSlug;
            if (skillSlug.includes('node')) dataKey = 'nodejs';
            if (skillSlug.includes('html')) dataKey = 'html-css';

            const bank = SKILL_DATA[dataKey] || SKILL_DATA['python'];

            const testQuestions = [];

            // Generate 100 questions
            for (let i = 0; i < 100; i++) {
                // Pick a random keyword/action pair
                const kwIdx = Math.floor(Math.random() * bank.keywords.length);
                const keyword = bank.keywords[kwIdx];
                const action_correct = bank.actions[kwIdx];

                // Get 3 random wrong actions
                const wrongActionIdxs = getRandomIndexes(bank.actions.length, 3, kwIdx);
                const wrongActions = wrongActionIdxs.map(idx => bank.actions[idx]);

                // Get 3 random wrong keywords
                const wrongKwIdxs = getRandomIndexes(bank.keywords.length, 3, kwIdx);
                const wrongKws = wrongKwIdxs.map(idx => bank.keywords[idx]);

                // Pick a template
                const template = TEMPLATES[i % TEMPLATES.length]; // cycle templates

                let qText = template.q
                    .replace('{keyword}', keyword)
                    .replace('{skill}', catInfo.name)
                    .replace('{level}', level)
                    .replace('{action_correct}', action_correct);

                let correctOpt = template.correct
                    .replace('{keyword}', keyword)
                    .replace('{action_correct}', action_correct);

                let wrongOpts = template.wrongs.map((w, wIdx) =>
                    w.replace('{keyword_wrong1}', wrongKws[0])
                        .replace('{keyword_wrong2}', wrongKws[1])
                        .replace('{keyword_wrong3}', wrongKws[2])
                        .replace('{action_wrong1}', wrongActions[0])
                        .replace('{action_wrong2}', wrongActions[1])
                        .replace('{action_wrong3}', wrongActions[2])
                );

                testQuestions.push({
                    category: test.category,
                    level: level,
                    text: capitalize(qText),
                    options: generateOptions(capitalize(correctOpt), wrongOpts.map(capitalize)),
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            // Insert into the database
            const result = await db.collection('questions').insertMany(testQuestions);
            totalInserted += result.insertedCount;
            console.log(`✅ Seeded ${result.insertedCount} questions for ${catInfo.name} (${level})`);
        }

        console.log(`\n🎉 Success! Inserted ${totalInserted} total realistic questions into the bank.`);

    } catch (e) {
        console.error("Error generating questions:", e);
    } finally {
        await client.close();
    }
}

generateQuestions();
