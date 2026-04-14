const http = require('http');

http.get('http://localhost:5000/health', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Health:', data);
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
