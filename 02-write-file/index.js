const fs = require('fs');
const path = require('path');
const { stdin, exit } = process;

const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

console.log('\nHi! \nEnter your text and press enter-key:\n(for exit press Ctrl+C or write: "exit")\n');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') { exit(); }

    output.write(data);
});
process.on('error', err => console.log('\nError', err.message));
process.on('exit', () => console.log('\nYour text is written to file: "text.txt". \nBye!'));
process.on('SIGINT', exit);