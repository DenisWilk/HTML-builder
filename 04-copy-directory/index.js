const path = require('path');
const { readdir, mkdir, copyFile, unlink } = require('fs/promises');

const folderPath = path.resolve(__dirname, 'files');
const folderCopyPath = path.resolve(__dirname, 'files-copy');

async function copyFolder(input, output) {
    try {
        await mkdir(output, { recursive: true });

        const delFiles = await readdir(output);
        const dataFolder = await readdir(input);

        delFiles.forEach(el => unlink(path.resolve(output, el)));
        dataFolder.forEach(el => copyFile(path.resolve(input, el), path.resolve(output, el)));
    }
    catch (err) { console.log('\nError:', err.message); }
}
copyFolder(folderPath, folderCopyPath);
