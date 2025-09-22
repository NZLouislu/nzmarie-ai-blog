const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/comments?postId=understanding-body-corporate-apartment-owners-new-zealand',
  method: 'GET'
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

req.end();