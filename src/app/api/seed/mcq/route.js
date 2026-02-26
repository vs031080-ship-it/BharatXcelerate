import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SkillCategory from '@/models/SkillCategory';
import Question from '@/models/Question';
import TestPaper from '@/models/TestPaper';

// ─── Skill categories ────────────────────────────────────────────────────────
const SKILLS = [
    { name: 'Python', slug: 'python', icon: '🐍' },
    { name: 'JavaScript', slug: 'javascript', icon: '🟨' },
    { name: 'React', slug: 'react', icon: '⚛️' },
    { name: 'Node.js', slug: 'nodejs', icon: '🟢' },
    { name: 'MongoDB', slug: 'mongodb', icon: '🍃' },
    { name: 'SQL', slug: 'sql', icon: '🗄️' },
    { name: 'HTML/CSS', slug: 'html-css', icon: '🎨' },
    { name: 'Git', slug: 'git', icon: '🔀' },
    { name: 'Data Structures', slug: 'data-structures', icon: '📊' },
    { name: 'REST APIs', slug: 'rest-apis', icon: '🔗' },
];

const LEVELS = ['beginner', 'intermediate', 'advanced'];

// ─── Question templates per skill (10 per level, repeated/varied to reach 100) ─
// Each entry: [question_text, [opt0, opt1, opt2, opt3], correctIndex]
const QUESTION_BANK = {
    python: {
        beginner: [
            ["What is the output of `print(type([]))`?", ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], 0],
            ["Which keyword defines a function in Python?", ["func", "def", "function", "define"], 1],
            ["How do you create an empty dictionary in Python?", ["{}", "[]", "()", "dict[]"], 0],
            ["What does `len('Hello')` return?", ["4", "5", "6", "Error"], 1],
            ["Which operator is used for floor division in Python?", ["/", "//", "%", "**"], 1],
            ["What is the correct way to comment a single line in Python?", ["// comment", "/* comment */", "# comment", "<!-- comment -->"], 2],
            ["What does `range(3)` produce?", ["[1,2,3]", "[0,1,2]", "[0,1,2,3]", "[1,2]"], 1],
            ["Which method removes all items from a list?", [".remove()", ".delete()", ".clear()", ".pop()"], 2],
            ["What is the result of `2 ** 3` in Python?", ["6", "8", "9", "5"], 1],
            ["Which of these is NOT a Python data type?", ["int", "float", "char", "str"], 2],
            ["How do you start a for loop over a list `x`?", ["for i in x:", "for (i in x):", "foreach i in x:", "loop i in x:"], 0],
            ["What does `str.upper()` do?", ["Converts to lowercase", "Converts to uppercase", "Reverses string", "Strips whitespace"], 1],
            ["Which module is used for math in Python?", ["mathematics", "math", "calc", "numeric"], 1],
            ["What is `None` in Python?", ["False", "0", "null value", "Empty string"], 2],
            ["How do you check membership in a list?", ["contains", "in", "has", "includes"], 1],
        ],
        intermediate: [
            ["What is a Python decorator?", ["A class modifier", "A function that extends another function", "A data structure", "A loop type"], 1],
            ["What does `*args` allow in a function?", ["Keyword arguments only", "Variable positional arguments", "Default arguments", "No arguments"], 1],
            ["Which method is used to apply a function to each element in a list?", ["filter()", "reduce()", "map()", "apply()"], 2],
            ["What is a list comprehension?", ["A comment block", "A concise way to create lists", "A list copy method", "A sorting algorithm"], 1],
            ["What does `__init__` do in a class?", ["Deletes the object", "Initializes the object", "Imports modules", "Defines static methods"], 1],
            ["What is the difference between `==` and `is`?", ["No difference", "`==` checks value, `is` checks identity", "`is` checks value", "`==` checks type"], 1],
            ["What does `lambda x: x*2` represent?", ["A class", "An anonymous function", "A loop", "An import"], 1],
            ["What is a generator in Python?", ["A function using `yield`", "A list factory", "A class decorator", "An import alias"], 0],
            ["What does `try...except` do?", ["Loops over items", "Handles exceptions", "Imports modules", "Defines functions"], 1],
            ["What is `self` in a Python method?", ["A global variable", "Reference to the current instance", "A static variable", "A reserved keyword with no use"], 1],
            ["Which built-in function sorts a list in-place?", ["sorted()", "list.sort()", "order()", "arrange()"], 1],
            ["What does `json.loads()` do?", ["Writes JSON to file", "Parses JSON string to dict", "Converts dict to JSON string", "Lists JSON keys"], 1],
            ["What is the purpose of `__str__` method?", ["Delete object", "Return string representation", "Sort object", "Copy object"], 1],
            ["Which keyword is used for inheritance?", ["inherits", "extends", "class Child(Parent):", "super"], 2],
            ["What does `zip([1,2],[3,4])` produce?", ["[1,2,3,4]", "[(1,3),(2,4)]", "[[1,3],[2,4]]", "{1:3, 2:4}"], 1],
        ],
        advanced: [
            ["What is the Global Interpreter Lock (GIL) in Python?", ["A file locking mechanism", "A mutex preventing true multi-threaded execution", "A module loader", "A database lock"], 1],
            ["What are metaclasses in Python?", ["Super classes", "Classes of classes", "Abstract base classes", "Singleton patterns"], 1],
            ["What does `asyncio` provide?", ["Multi-processing", "Asynchronous I/O event loop", "Thread pooling", "Garbage collection"], 1],
            ["What is the difference between `deepcopy` and `copy`?", ["No difference", "`deepcopy` recursively copies nested objects", "`copy` is faster always", "`deepcopy` only copies references"], 1],
            ["What is a context manager and which protocol does it use?", ["Class with __init__", "Class with __enter__ and __exit__", "Class with __call__", "Class with __new__"], 1],
            ["What does `__slots__` do?", ["Extends class slots", "Restricts instance attributes to reduce memory", "Adds thread slots", "Creates named tuples"], 1],
            ["What is monkey patching?", ["Fixing bugs at runtime", "Dynamically modifying class/module behavior at runtime", "A testing strategy", "A Python version upgrade"], 1],
            ["What is the purpose of `functools.lru_cache`?", ["Logging", "Memoization/caching function results", "Thread locking", "Async handling"], 1],
            ["What is the MRO in Python?", ["Memory Resource Object", "Method Resolution Order", "Module Runtime Object", "Main Runtime Operator"], 1],
            ["What does `__new__` do vs `__init__`?", ["Both are same", "`__new__` creates instance, `__init__` initializes it", "`__init__` creates instance", "`__new__` is for metaclasses only"], 1],
            ["What is a descriptor in Python?", ["A docstring", "Object implementing __get__, __set__, __delete__", "A named tuple", "A file reader"], 1],
            ["What does `abc.ABC` provide?", ["Abstract base classes", "Automatic byte conversion", "Array byte class", "Async base controller"], 0],
            ["How does Python manage memory?", ["Manual malloc/free", "Reference counting + garbage collection", "Stack-only allocation", "OS-level management only"], 1],
            ["What is `__call__` used for?", ["Making object callable like a function", "Calling parent class", "Calling async methods", "Making class abstract"], 0],
            ["What is the difference between `ProcessPoolExecutor` and `ThreadPoolExecutor`?", ["No difference", "Processes bypass GIL; threads share memory but are GIL-bound", "Threads use multiple CPUs", "ProcessPool is slower always"], 1],
        ],
    },
    javascript: {
        beginner: [
            ["Which keyword declares a block-scoped variable in JS?", ["var", "let", "variable", "dim"], 1],
            ["What does `typeof null` return?", ["'null'", "'undefined'", "'object'", "'boolean'"], 2],
            ["Which method converts JSON string to JS object?", ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.decode()"], 0],
            ["What is the output of `'5' + 3` in JS?", ["8", "'53'", "Error", "15"], 1],
            ["Which event fires when the DOM is ready?", ["onload", "DOMContentLoaded", "onready", "domloaded"], 1],
            ["How do you declare an arrow function?", ["function => {}", "const f = () => {}", "def f() =>{}", "arrow f() {}"], 1],
            ["What does `===` check?", ["Value only", "Type only", "Value and type", "Reference"], 2],
            ["How do you access the first element of array `arr`?", ["arr.first()", "arr[1]", "arr[0]", "arr.get(0)"], 2],
            ["What is `NaN`?", ["Null and None", "Not a Number", "Negative and Null", "New Array Number"], 1],
            ["Which method adds an element to the end of an array?", ["push()", "append()", "add()", "insert()"], 0],
            ["What is the correct syntax for a JS object?", ["let o = {name: 'A'}", "let o = [name: 'A']", "let o = (name: 'A')", "let o = <name: 'A'>"], 0],
            ["What does `console.log()` do?", ["Creates alert", "Logs to browser console", "Writes to file", "Sends to server"], 1],
            ["Which loop is guaranteed to execute at least once?", ["for", "while", "do...while", "foreach"], 2],
            ["What is `undefined` in JavaScript?", ["An error type", "A variable declared but not assigned", "A null alias", "A string literal"], 1],
            ["What does `Array.isArray([])` return?", ["false", "true", "undefined", "Error"], 1],
        ],
        intermediate: [
            ["What is a closure in JavaScript?", ["A class method", "A function with access to its outer scope's variables", "An async function", "A sealed object"], 1],
            ["What does `Promise.all()` do?", ["Runs promises one by one", "Waits for all promises to resolve", "Catches errors only", "Cancels all promises"], 1],
            ["What is event bubbling?", ["Event fires from child to parent", "Event fires from parent to child", "Event fires once", "Event is cancelled"], 0],
            ["What does `async/await` simplify?", ["DOM manipulation", "Promise-based asynchronous code", "CSS animations", "Database queries"], 1],
            ["What is the prototype chain?", ["Class hierarchy", "Mechanism for object inheritance through __proto__", "A design pattern", "An array method chain"], 1],
            ["What does `Array.prototype.reduce()` do?", ["Filters elements", "Reduces array to a single value", "Maps over array", "Sorts array"], 1],
            ["What is `this` in an arrow function?", ["The function itself", "Inherited from enclosing lexical scope", "The global object always", "undefined always"], 1],
            ["What is the Temporal Dead Zone (TDZ)?", ["Async delay zone", "Period before `let`/`const` declaration is initialized", "Network timeout zone", "Event loop dead period"], 1],
            ["What does `Object.freeze()` do?", ["Creates deep copy", "Prevents modification of object properties", "Deletes object", "Converts object to JSON"], 1],
            ["What does the spread operator `...` do?", ["Loops over items", "Expands iterable into individual elements", "Creates async chain", "Binds this context"], 1],
            ["What is debouncing?", ["Event cancellation", "Delaying function execution until after a pause", "Batch DOM updates", "Promise rejection handling"], 1],
            ["What is `localStorage`?", ["Session-only storage", "Persistent browser key-value storage", "Server-side cache", "Cookie alternative with expiry"], 1],
            ["What is a higher-order function?", ["A top-level function", "A function that takes or returns another function", "An async function", "A pure function"], 1],
            ["What does `bind()` do?", ["Calls the function immediately", "Creates new function with fixed `this`", "Delays function", "Clones the function"], 1],
            ["What is optional chaining `?.`?", ["Null assertion", "Safely access nested properties without throwing if null", "Conditional import", "Async chain operator"], 1],
        ],
        advanced: [
            ["What is the event loop in JavaScript?", ["A for-loop variant", "Mechanism that processes the callback queue after the call stack is empty", "A DOM event handler", "A CSS animation loop"], 1],
            ["What are WeakMap and WeakSet?", ["Deprecated collections", "Collections with weakly-held references allowing GC", "Immutable maps", "Thread-safe maps"], 1],
            ["What is tree shaking?", ["DOM manipulation", "Removing unused code during bundling", "Sorting a BST", "Clearing memory"], 1],
            ["What is a Proxy object in JS?", ["An HTTP proxy", "An object that intercepts operations on another object", "A cached result", "A service worker"], 1],
            ["What does `Symbol` provide?", ["A string alias", "A unique and immutable primitive value", "A numeric ID", "A class descriptor"], 1],
            ["What is a microtask in JS?", ["A small async function", "A task queued after current operation, before macro-tasks (e.g. Promises)", "A web worker message", "A setTimeout with 0ms"], 1],
            ["What is the difference between `call`, `apply`, and `bind`?", ["No difference", "`call` passes args individually, `apply` as array, `bind` returns new function", "`bind` calls immediately", "`apply` returns new function"], 1],
            ["What is a Service Worker?", ["A server-side script", "A browser script that runs in background for caching/push", "A web component", "A DOM listener"], 1],
            ["What is memoization?", ["Memory management", "Caching function results for the same inputs", "Garbage collection", "Lazy loading"], 1],
            ["What is the difference between `==` and `===` in type coercion?", ["No difference", "`==` coerces types, `===` does not", "`===` coerces types", "Both coerce types"], 1],
            ["What does `Object.create(proto)` do?", ["Copies an object", "Creates an object with specified prototype", "Freezes an object", "Merges objects"], 1],
            ["What is tail call optimization?", ["A CSS optimization", "Compiler optimization for recursive tail calls to avoid stack overflow", "A sorting optimization", "An async trick"], 1],
            ["What is the difference between CommonJS and ES Modules?", ["They are identical", "CJS uses require/exports, ESM uses import/export and is static", "ESM uses require", "CJS is browser-only"], 1],
            ["What are generators in JavaScript?", ["Value factories", "Functions using yield to pause/resume execution", "Async helpers", "Iterable arrays"], 1],
            ["What is the `Reflect` API?", ["A mirror object", "Built-in object providing methods for interceptable JS operations", "A debugging tool", "A prototype utility"], 1],
        ],
    },
};

// For skills without explicit questions, generate template-based fillers
function generateFillerQuestions(skillName, level, count) {
    const topicsBySkill = {
        react: ['components', 'hooks', 'state', 'props', 'JSX', 'lifecycle', 'context', 'Redux', 'refs', 'portals', 'Suspense', 'lazy loading', 'memoization', 'error boundaries', 'reconciliation'],
        nodejs: ['modules', 'streams', 'events', 'fs module', 'http module', 'middleware', 'clustering', 'child_process', 'buffers', 'crypto', 'path module', 'os module', 'worker threads', 'npm', 'package.json'],
        mongodb: ['collections', 'documents', 'BSON', 'aggregation', 'indexing', 'sharding', 'replication', 'transactions', 'schema validation', 'TTL indexes', 'text search', 'geospatial', 'Atlas', 'Mongoose', 'find operators'],
        sql: ['SELECT', 'JOIN', 'GROUP BY', 'HAVING', 'subqueries', 'indexes', 'transactions', 'normalization', 'stored procedures', 'triggers', 'constraints', 'views', 'ACID', 'window functions', 'CTEs'],
        'html-css': ['semantic HTML', 'flexbox', 'grid', 'box model', 'specificity', 'media queries', 'animations', 'transforms', 'variables', 'pseudo-classes', 'accessibility', 'forms', 'meta tags', 'SVG', 'canvas'],
        git: ['commit', 'branch', 'merge', 'rebase', 'stash', 'cherry-pick', 'reset', 'revert', 'remote', 'fetch', 'pull', 'push', 'tag', 'blame', 'bisect'],
        'data-structures': ['arrays', 'linked lists', 'stacks', 'queues', 'trees', 'graphs', 'heaps', 'hash tables', 'tries', 'BST', 'AVL trees', 'Big O', 'DFS', 'BFS', 'dynamic programming'],
        'rest-apis': ['HTTP methods', 'status codes', 'headers', 'authentication', 'authorization', 'pagination', 'rate limiting', 'versioning', 'CORS', 'REST constraints', 'JSON:API', 'OpenAPI', 'JWT', 'OAuth', 'caching'],
    };

    const topics = topicsBySkill[skillName] || ['concept A', 'concept B', 'concept C', 'concept D', 'concept E', 'concept F', 'concept G', 'concept H', 'concept I', 'concept J', 'concept K', 'concept L', 'concept M', 'concept N', 'concept O'];
    const questions = [];

    for (let i = 0; i < count; i++) {
        const topic = topics[i % topics.length];
        const variant = Math.floor(i / topics.length) + 1;
        const q = `[${level.toUpperCase()} v${variant}] Which statement about ${topic} in ${skillName} is correct?`;
        const correct = `The standard/correct usage of ${topic} in ${skillName}`;
        questions.push({
            text: q,
            options: [
                { text: correct, isCorrect: true },
                { text: `An incorrect interpretation of ${topic} — option A`, isCorrect: false },
                { text: `A common misconception about ${topic} — option B`, isCorrect: false },
                { text: `An unrelated concept sometimes confused with ${topic}`, isCorrect: false },
            ],
        });
    }
    return questions;
}

export async function GET(req) {
    // Only allow in dev or with secret
    if (process.env.NODE_ENV === 'production' && req.headers.get('x-seed-secret') !== process.env.SEED_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await connectDB();

        const report = { skills: 0, questions: 0, tests: 0, errors: [] };

        // 1. Upsert Skill Categories
        const categoryMap = {};
        for (const skill of SKILLS) {
            const cat = await SkillCategory.findOneAndUpdate(
                { slug: skill.slug },
                { $setOnInsert: { name: skill.name, slug: skill.slug, icon: skill.icon, active: true } },
                { upsert: true, new: true }
            );
            categoryMap[skill.slug] = cat;
            report.skills++;
        }

        // 2. Seed Questions — 100 per skill per level
        const TARGET_PER_COMBO = 100;

        for (const skill of SKILLS) {
            const cat = categoryMap[skill.slug];

            for (const level of LEVELS) {
                const existing = await Question.countDocuments({ category: cat._id, level, active: true });
                if (existing >= TARGET_PER_COMBO) continue; // already seeded

                const needed = TARGET_PER_COMBO - existing;

                // Use hand-crafted questions if available
                const bank = QUESTION_BANK[skill.slug]?.[level] || [];
                const handCrafted = bank.map(([text, opts, correctIdx]) => ({
                    text,
                    options: opts.map((o, i) => ({ text: o, isCorrect: i === correctIdx })),
                }));

                // Pad with filler to reach 100
                const padCount = Math.max(0, needed - handCrafted.length);
                const filler = generateFillerQuestions(skill.slug, level, padCount);
                const allQ = [...handCrafted, ...filler].slice(0, needed);

                const docs = allQ.map(q => ({
                    category: cat._id,
                    level,
                    text: q.text,
                    options: q.options,
                    active: true,
                }));

                if (docs.length > 0) {
                    await Question.insertMany(docs, { ordered: false });
                    report.questions += docs.length;
                }
            }
        }

        // 3. Seed Test Papers — one per skill+level
        for (const skill of SKILLS) {
            const cat = categoryMap[skill.slug];
            for (const level of LEVELS) {
                const poolCount = await Question.countDocuments({ category: cat._id, level, active: true });
                const exists = await TestPaper.findOne({ category: cat._id, level });
                if (!exists) {
                    await TestPaper.create({
                        category: cat._id,
                        level,
                        badgeLabel: `${skill.name} Developer — ${level.charAt(0).toUpperCase() + level.slice(1)}`,
                        config: { duration: 120, questionsCount: 50, totalMarks: 100, passingScore: 40 },
                        active: poolCount >= 100,
                    });
                    report.tests++;
                }
            }
        }

        return NextResponse.json({ success: true, seeded: report });
    } catch (e) {
        console.error('Seed error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
