const http = require('http');

console.log('Testando servidor FiberNOC na porta 3000...\n');

// Test 1: Health endpoint
http.get('http://localhost:3000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ GET /api/health');
    console.log('   Status:', res.statusCode);
    console.log('   Response:', data);
  });
}).on('error', (e) => console.log('❌ Health Error:', e.message));

// Test 2: Stats endpoint
setTimeout(() => {
  http.get('http://localhost:3000/api/stats', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n✅ GET /api/stats');
      console.log('   Status:', res.statusCode);
      console.log('   Response:', data);
    });
  }).on('error', (e) => console.log('❌ Stats Error:', e.message));
}, 500);

// Test 3: ONUs endpoint
setTimeout(() => {
  http.get('http://localhost:3000/api/onus', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n✅ GET /api/onus');
      console.log('   Status:', res.statusCode);
      console.log('   Response:', data.substring(0, 200) + '...');
    });
  }).on('error', (e) => console.log('❌ ONUs Error:', e.message));
}, 1000);

// Test 4: Login endpoint
setTimeout(() => {
  const postData = JSON.stringify({ username: 'admin', password: 'admin123' });
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n✅ POST /api/auth/login');
      console.log('   Status:', res.statusCode);
      console.log('   Response:', data);
    });
  });

  req.on('error', (e) => console.log('❌ Login Error:', e.message));
  req.write(postData);
  req.end();
}, 1500);
