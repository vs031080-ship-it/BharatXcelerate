import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestPaper from '@/models/TestPaper';
import { getUserFromRequest } from '@/lib/auth';

// Descriptions keyed by a loose match: category slug + level
const DESCRIPTIONS = {
    // Python
    'python-beginner':       'Start your Python journey with this foundational exam. Topics include variables, data types, control flow, functions, and basic OOP concepts. Perfect for students writing their first Python scripts and building core programming logic.',
    'python-intermediate':   'Validate intermediate Python skills covering list comprehensions, file I/O, decorators, generators, exception handling, and standard library modules. Ideal for developers building real-world Python applications.',
    'python-advanced':       'Prove expert-level Python mastery — metaclasses, concurrency (asyncio, threading), memory management, C extensions, and performance optimization. Designed for senior developers and data engineers.',

    // React
    'react-beginner':        'Test your foundational React skills: JSX, functional components, props, state with useState, and basic event handling. This exam is ideal for developers just getting started with building React UIs.',
    'react-intermediate':    'Covers hooks (useEffect, useContext, useMemo, useCallback), component lifecycle, routing, form handling, and state management patterns. For developers comfortable building full React SPAs.',
    'react-advanced':        'Advanced React exam covering performance optimization, custom hooks, code splitting, SSR vs CSR tradeoffs, reconciliation algorithm, and concurrent features. For senior frontend engineers.',

    // Node.js / Node
    'node-beginner':         'Get assessed on Node.js fundamentals: the event loop, module system (CommonJS/ESM), fs module, http module, and building simple REST APIs. Entry-level backend development concepts.',
    'node-js-beginner':      'Get assessed on Node.js fundamentals: the event loop, module system (CommonJS/ESM), fs module, http module, and building simple REST APIs. Entry-level backend development concepts.',
    'node-intermediate':     'Covers Express.js, middleware design, REST API best practices, JWT authentication, and database integration with MongoDB/PostgreSQL. For developers building production APIs.',
    'node-js-intermediate':  'Covers Express.js, middleware design, REST API best practices, JWT authentication, and database integration with MongoDB/PostgreSQL. For developers building production APIs.',
    'node-advanced':         'In-depth Node.js exam: streams, worker threads, cluster module, memory leaks, performance profiling, microservices patterns, and event-driven architecture. For backend architects.',
    'node-js-advanced':      'In-depth Node.js exam: streams, worker threads, cluster module, memory leaks, performance profiling, microservices patterns, and event-driven architecture. For backend architects.',

    // SQL / PostgreSQL / MySQL / Database
    'sql-beginner':          'Foundational SQL exam covering SELECT queries, filtering with WHERE, JOINs, GROUP BY, aggregate functions, and basic table design. For anyone getting started with relational databases.',
    'sql-intermediate':      'Tests subqueries, window functions, CTEs, indexing strategies, transactions, and normalization. For developers writing complex data queries in production systems.',
    'sql-advanced':          'Advanced SQL: query optimization, execution plans, partitioning, stored procedures, triggers, and database design for high-traffic applications. For senior DBAs and data engineers.',
    'postgresql-beginner':   'Foundational PostgreSQL exam — data types, basic DDL/DML, constraints, and simple queries. For developers getting started with Postgres as a primary database.',
    'postgresql-intermediate':'Intermediate Postgres: JSON/JSONB queries, full-text search, CTEs, window functions, and performance tuning with EXPLAIN. For backend developers using Postgres in production.',
    'postgresql-advanced':   'Advanced PostgreSQL covering partitioning, logical replication, advanced indexing (GIN/GIST), PL/pgSQL procedures, and high availability setups.',

    // JavaScript
    'javascript-beginner':   'Core JavaScript fundamentals: variables, data types, loops, functions, DOM manipulation, and events. The essential starting point for any web developer.',
    'javascript-intermediate':'Covers closures, promises, async/await, prototypal inheritance, ES6+ features, and the browser APIs. For developers building interactive web applications.',
    'javascript-advanced':   'Deep JavaScript: event loop mechanics, memory management, design patterns, module systems, TypeScript compatibility, and V8 engine internals. For senior JS engineers.',

    // TypeScript
    'typescript-beginner':   'Introduction to TypeScript: type annotations, interfaces, enums, basic generics, and compiling TS to JS. For JavaScript developers making the jump to typed code.',
    'typescript-intermediate':'Intermediate TypeScript: advanced generics, utility types, conditional types, decorators, and integrating TypeScript in React/Node projects.',
    'typescript-advanced':   'Expert TypeScript: type-level programming, mapped types, template literal types, declaration files, and performance at scale for large codebases.',

    // Docker
    'docker-beginner':       'Introduction to Docker: images, containers, Dockerfiles, volumes, and basic networking. For developers packaging their first applications in containers.',
    'docker-intermediate':   'Docker Compose, multi-stage builds, image optimization, container networking, and secrets management. For teams deploying microservices with Docker.',
    'docker-advanced':       'Advanced Docker: custom runtimes, security hardening, resource limits, Docker Swarm basics, and integrating Docker into CI/CD pipelines at scale.',

    // AWS / Cloud
    'aws-beginner':          'AWS fundamentals: EC2, S3, IAM, VPC, and the AWS management console. For cloud beginners working toward their first AWS certification.',
    'aws-intermediate':      'Covers RDS, Lambda, API Gateway, CloudFront, SQS/SNS, and cost optimization strategies. For developers building serverless and cloud-native applications on AWS.',
    'aws-advanced':          'Advanced AWS: multi-region architectures, CDK/CloudFormation, container orchestration with ECS/EKS, security best practices, and well-architected framework.',

    // Git
    'git-beginner':          'Git fundamentals: init, clone, add, commit, push, pull, and branch basics. For developers starting out with version control and collaborative coding.',
    'git-intermediate':      'Covers rebasing, cherry-picking, merge strategies, resolving conflicts, git hooks, and maintaining a clean commit history for team projects.',
    'git-advanced':          'Advanced Git: internal object model, reflog, submodules, bisect for debugging, and scaling Git for large monorepos. For DevOps engineers and tech leads.',

    // GraphQL / REST APIs
    'graphql-beginner':      'GraphQL basics: schema definition, queries, mutations, and the resolver pattern. For developers migrating from REST or adding a GraphQL layer to their stack.',
    'graphql-intermediate':  'Covers subscriptions, DataLoader for batching, schema stitching, authentication, and connecting GraphQL to existing databases.',
    'graphql-advanced':      'Advanced GraphQL: federation, persisted queries, performance tuning, custom scalars, and building production-grade GraphQL gateways.',
    'rest-apis-beginner':    'REST API fundamentals: HTTP methods, status codes, request/response structure, authentication with API keys/JWT, and designing resource URIs.',
    'rest-apis-intermediate':'Best practices for REST: versioning, pagination, rate limiting, HATEOAS, and building clean, well-documented APIs for client consumption.',
    'rest-apis-advanced':    'Advanced REST concepts: API gateway patterns, event-driven APIs, OpenAPI specification, API security (OAuth2), and large-scale service design.',

    // Data Structures
    'data-structures-beginner':     'Core data structures: arrays, linked lists, stacks, queues, and hash tables. Fundamental concepts for any aspiring software developer preparing for technical interviews.',
    'data-structures-intermediate': 'Intermediate data structures: trees, heaps, graphs, and their traversal algorithms (BFS/DFS). For developers solving complex algorithmic problems.',
    'data-structures-advanced':     'Advanced data structures: tries, segment trees, disjoint sets (Union-Find), and AVL/Red-Black trees. For competitive programmers and senior engineers.',

    // Default fallback shape
    '__default_beginner':    'A beginner-level exam designed to assess foundational knowledge in this skill area. Covers core concepts, terminology, and entry-level problem-solving.',
    '__default_intermediate':'An intermediate exam testing practical, real-world application of this skill. Expect applied questions on best practices and common developer scenarios.',
    '__default_advanced':    'An advanced exam for experienced professionals. Tests deep technical knowledge, edge cases, and architectural decision-making at scale.',
};

function getDescription(categorySlug, level) {
    const key = `${categorySlug}-${level}`;
    return DESCRIPTIONS[key] || DESCRIPTIONS[`__default_${level}`] || '';
}

// POST /api/admin/tests/seed-descriptions  — seeds missing descriptions
export async function POST(req) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tests = await TestPaper.find().populate('category', 'name slug');
        let updated = 0;

        for (const test of tests) {
            const slug   = test.category?.slug || '';
            const level  = test.level || 'beginner';
            const desc   = getDescription(slug, level);
            if (desc && (!test.description || test.description.trim() === '')) {
                await TestPaper.findByIdAndUpdate(test._id, { description: desc });
                updated++;
            }
        }

        return NextResponse.json({ message: `Updated ${updated} exam descriptions.`, total: tests.length });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
