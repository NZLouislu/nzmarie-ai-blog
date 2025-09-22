const http = require('http');

// Test getting stats
const getOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/stats?postId=understanding-body-corporate-apartment-owners-new-zealand&language=en',
  method: 'GET'
};

const getReq = http.request(getOptions, res => {
  console.log(`GET Status: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
  
  res.on('end', () => {
    console.log('\nGET Response ended');
  });
});

getReq.on('error', error => {
  console.error('GET Error:', error);
});

getReq.end();