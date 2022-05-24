const fs = require('fs');
const path = require('path');
const { readFile, writeFile, readdir, copyFile, rm, mkdir } = require('fs/promises');

const assetsPath = path.resolve(__dirname, 'assets');
const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const templatePath = path.resolve(__dirname, 'template.html');
const outputFolderPath = path.resolve(__dirname, 'project-dist');
const outputAssetsPath = path.resolve(outputFolderPath, 'assets');
const outputCssPath = path.resolve(outputFolderPath, 'style.css');

async function useTemplate(input, output, parts) {
    try {
        let template = await readFile(input, 'utf8');
        const templateTags = template.match(/{{\w+}}/g);
        const componentsTags = templateTags.map(el => { return readFile(path.resolve(parts, `${el.slice(2, -2)}.html`)); })
        const insertTags = await Promise.all(componentsTags);

        insertTags.forEach((item) => {
            template = template.replace(/{{\w+}}/, item);
        });
        await writeFile(path.resolve(output, 'index.html'), template, 'utf8');
    } catch (err) { console.log('\nError:', err.message); }
}

async function mountCss(input, output) {
    try {
        const parts = await readdir(input, { withFileTypes: true });
        const css = [];

        for (let part of parts) {
            const cssFile = path.extname(path.resolve(input, part.name));

            if (part.isFile() && cssFile === '.css') {
                const parts = fs.createReadStream(path.resolve(input, part.name));

                for await (let part of parts) {
                    css.push(part);
                }
            }
        }
        await writeFile(path.resolve(output), css.join(''));
    }
    catch (err) { console.log('\nError:', err.message); }
}

async function copyFolder(input, output) {
    try {
        const elements = await readdir(input, { withFileTypes: true });
        await mkdir(output, { recursive: true });

        for (let el of elements) {
            if (el.isFile()) {
                await copyFile(path.resolve(input, el.name), path.resolve(output, el.name));
            }
            if (el.isDirectory()) {
                await mkdir(path.resolve(output, el.name));
                await copyFolder(path.resolve(input, el.name), path.resolve(output, el.name));
            }
        }
    }
    catch (err) { console.log('\nError:', err.message); }
}

async function mountPage() {
    await rm(outputFolderPath, { recursive: true, force: true });

    useTemplate(templatePath, outputFolderPath, componentsPath);
    mountCss(stylesPath, outputCssPath);
    copyFolder(assetsPath, outputAssetsPath);
}
mountPage();