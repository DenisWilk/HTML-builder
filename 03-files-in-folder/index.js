const path = require('path');
const { readdir, stat } = require('fs/promises');

const folderPath = path.resolve(__dirname, 'secret-folder');

async function getFilesData(folder) {
    try {
        const elements = await readdir(folder, { withFileTypes: true });

        for (let el of elements) {
            if (el.isFile()) {
                const data = await stat(path.resolve(folder, el.name));
                
                console.log(`
                 \r ${path.parse(el.name).name} - ${path.extname(el.name).substring(1)} - ${Math.ceil(data.size / 1024)} KB`);
            }
        }
    }
    catch (err) { console.log('\nError: ', err.message); }
}
getFilesData(folderPath);