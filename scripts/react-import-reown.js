// see: https://github.com/reown-com/appkit-react-native/issues/278#issuecomment-2646519029
const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..', 'node_modules/@reown');

let totalFiles = 0;
let updatedFiles = 0;

function addReactImportRecursively(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addReactImportRecursively(filePath);
    } else if (file.endsWith('.js')) {
      totalFiles++;
      const content = fs.readFileSync(filePath, 'utf-8');

      if (!content.includes('import React')) {
        const newContent = `import React from 'react';\n${content}`;
        fs.writeFileSync(filePath, newContent, 'utf-8');
        updatedFiles++;
        console.log(`Updated: ${filePath}`);
      } else {
        console.log(`Skipping: ${filePath} (React already imported)`);
      }
    }
  });
}

addReactImportRecursively(rootPath);

console.log(`\nTotal '.js' files processed (excluding index.js): ${totalFiles}`);
console.log(`Files updated: ${updatedFiles}`);
console.log(`Files skipped (already had React import): ${totalFiles - updatedFiles}`);
