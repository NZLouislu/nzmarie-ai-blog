const http = require('http');

const data = JSON.stringify({
  postId: "understanding-body-corporate-apartment-owners-new-zealand",
  language: "en"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/stats',
  method: 'PUT',
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