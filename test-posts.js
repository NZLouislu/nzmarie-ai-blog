const { getAllPosts } = require('./lib/posts');

async function testPosts() {
  console.log('Testing EN posts...');
  try {
    const enPosts = getAllPosts('en');
    console.log('EN posts count:', enPosts.length);
    console.log('First EN post:', enPosts[0]?.title);
  } catch (e) {
    console.error('Error getting EN posts:', e);
  }

  console.log('\nTesting ZH posts...');
  try {
    const zhPosts = getAllPosts('zh');
    console.log('ZH posts count:', zhPosts.length);
    console.log('First ZH post:', zhPosts[0]?.title);
  } catch (e) {
    console.error('Error getting ZH posts:', e);
  }
}

testPosts().catch(console.error);