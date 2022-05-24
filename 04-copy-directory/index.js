const path = require('path');
const { readdir, mkdir, copyFile, unlink } = require('fs/promises');

const folderPath = path.resolve(__dirname, 'files');
const folderCopyPath = path.resolve(__dirname, 'files-copy');

async function copyFolder(input, output) {
    try {
        const elements = await readdir(input, { withFileTypes: true });
        const delFiles = await readdir(output);

        await mkdir(output, { recursive: true });
        delFiles.forEach(el => unlink(path.resolve(output, el)));

        for (let el of elements) {
            await copyFile(path.resolve(input, el.name), path.resolve(output, el.name));
        }
    }
    catch (err) { console.log('\nError:', err.message); }
}
copyFolder(folderPath, folderCopyPath);