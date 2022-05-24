const fs = require('fs');
const path = require('path');
const { readdir, writeFile } = require('fs/promises');

const inputPath = path.resolve(__dirname, 'styles');
const outputPath = path.resolve(__dirname, 'project-dist');

async function mountBundle(input, output) {
    try {
        const parts = await readdir(input, { withFileTypes: true });
        const bundle = [];

        for (let part of parts) {
            const cssFile = path.extname(path.resolve(input, part.name));

            if (part.isFile() && cssFile === '.css') {
                const parts = fs.createReadStream(path.resolve(input, part.name));

                for await (let part of parts) {
                    bundle.push(part);
                }
            }
        }
        await writeFile(path.resolve(output, 'bundle.css'), bundle.join(''));
    }
    catch (err) { console.log('\nError:', err.message); }
}
mountBundle(inputPath, outputPath);