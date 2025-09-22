"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var user, posts, _i, posts_1, postData, post, error_1, post1, post2, postStats, _a, postStats_1, stat, created, error_2, comments, _b, comments_1, comment, created, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('Starting seed...');
                    // Create a sample user for posts
                    console.log('Creating user...');
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'nzmarie@example.com' },
                            update: {},
                            create: {
                                email: 'nzmarie@example.com',
                                name: 'NZMarie',
                                role: 'admin',
                                languagePreferences: 'both'
                            }
                        })];
                case 1:
                    user = _c.sent();
                    console.log('Created/Found user:', user.email);
                    // Create sample posts
                    console.log('Creating posts...');
                    posts = [
                        {
                            id: 'sample-post-1-en',
                            authorId: user.id,
                            slug: '2024-01-10-will-ai-replace-human-developers',
                            title: 'Will AI Replace Human Developers?',
                            content: 'Sample content for the article...',
                            language: 'en',
                            status: 'published',
                            tags: 'AI,Development,Future'
                        },
                        {
                            id: 'sample-post-2-en',
                            authorId: user.id,
                            slug: '2024-01-20-new_zealand_paradise_for_children',
                            title: 'New Zealand: Paradise for Children',
                            content: 'Sample content for the article...',
                            language: 'en',
                            status: 'published',
                            tags: 'New Zealand,Travel,Family'
                        }
                    ];
                    _i = 0, posts_1 = posts;
                    _c.label = 2;
                case 2:
                    if (!(_i < posts_1.length)) return [3 /*break*/, 7];
                    postData = posts_1[_i];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    console.log('Creating post:', postData.title);
                    return [4 /*yield*/, prisma.post.upsert({
                            where: { id: postData.id },
                            update: {},
                            create: postData
                        })];
                case 4:
                    post = _c.sent();
                    console.log('Created/Found Post:', post.title);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    console.error('Error creating post:', postData.title, error_1.message);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    // Clear existing data
                    console.log('Clearing existing data...');
                    return [4 /*yield*/, prisma.postStat.deleteMany()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, prisma.comment.deleteMany()];
                case 9:
                    _c.sent();
                    console.log('Cleared existing data');
                    // Get the actual post IDs
                    console.log('Fetching posts...');
                    return [4 /*yield*/, prisma.post.findUnique({
                            where: { id: 'sample-post-1-en' }
                        })];
                case 10:
                    post1 = _c.sent();
                    return [4 /*yield*/, prisma.post.findUnique({
                            where: { id: 'sample-post-2-en' }
                        })];
                case 11:
                    post2 = _c.sent();
                    console.log('Post1:', post1 ? 'Found' : 'Not found');
                    console.log('Post2:', post2 ? 'Found' : 'Not found');
                    if (!(post1 && post2)) return [3 /*break*/, 24];
                    // Create sample post stats
                    console.log('Creating post stats...');
                    postStats = [
                        {
                            post_id: post1.id,
                            title: 'Will AI Replace Human Developers?',
                            language: 'en',
                            views: 150,
                            likes: 25,
                            ai_questions: 5,
                            ai_summaries: 3
                        },
                        {
                            post_id: post2.id,
                            title: 'New Zealand: Paradise for Children',
                            language: 'en',
                            views: 200,
                            likes: 30,
                            ai_questions: 7,
                            ai_summaries: 4
                        }
                    ];
                    _a = 0, postStats_1 = postStats;
                    _c.label = 12;
                case 12:
                    if (!(_a < postStats_1.length)) return [3 /*break*/, 17];
                    stat = postStats_1[_a];
                    _c.label = 13;
                case 13:
                    _c.trys.push([13, 15, , 16]);
                    console.log('Creating post stat:', stat.title);
                    return [4 /*yield*/, prisma.postStat.upsert({
                            where: { post_id: stat.post_id },
                            update: {},
                            create: stat
                        })];
                case 14:
                    created = _c.sent();
                    console.log('Created/Found PostStat:', created.title);
                    return [3 /*break*/, 16];
                case 15:
                    error_2 = _c.sent();
                    console.error('Error creating post stat:', stat.title, error_2.message);
                    return [3 /*break*/, 16];
                case 16:
                    _a++;
                    return [3 /*break*/, 12];
                case 17:
                    // Create sample comments
                    console.log('Creating comments...');
                    comments = [
                        {
                            postId: post1.id,
                            authorName: 'John Doe',
                            authorEmail: 'john@example.com',
                            content: 'Great article! Very insightful.',
                            status: 'approved'
                        },
                        {
                            postId: post1.id,
                            authorName: 'Jane Smith',
                            authorEmail: 'jane@example.com',
                            content: 'Thanks for sharing this perspective!',
                            status: 'approved'
                        }
                    ];
                    _b = 0, comments_1 = comments;
                    _c.label = 18;
                case 18:
                    if (!(_b < comments_1.length)) return [3 /*break*/, 23];
                    comment = comments_1[_b];
                    _c.label = 19;
                case 19:
                    _c.trys.push([19, 21, , 22]);
                    console.log('Creating comment for post:', post1.title);
                    return [4 /*yield*/, prisma.comment.create({ data: comment })];
                case 20:
                    created = _c.sent();
                    console.log('Created Comment:', created.id);
                    return [3 /*break*/, 22];
                case 21:
                    error_3 = _c.sent();
                    console.error('Error creating comment:', error_3.message);
                    return [3 /*break*/, 22];
                case 22:
                    _b++;
                    return [3 /*break*/, 18];
                case 23: return [3 /*break*/, 25];
                case 24:
                    console.log('Could not find posts, skipping stats and comments');
                    _c.label = 25;
                case 25:
                    console.log('Database seeded successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
