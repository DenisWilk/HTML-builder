const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, './text1.txt'), 'utf8');
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(`\n${data}`));
stream.on('error', err => console.log('\nError:', err.message));