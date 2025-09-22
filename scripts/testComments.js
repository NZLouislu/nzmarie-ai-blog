const http = require('http');

const data = JSON.stringify({
  postId: "understanding-body-corporate-apartment-owners-new-zealand",
  authorName: "Test User",
  authorEmail: "test@example.com",
  content: "This is a test comment",
  isAnonymous: false,
  language: "en"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/comments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log(`Status: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
  
  res.on('end', () => {
    console.log('\nResponse ended');
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();