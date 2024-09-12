const fs = require('fs');
const path = require('path');

async function moveFile ({ filename, filePath, processedDir }) {
  try {
    const newFilename = path.join(processedDir, filename);
    await fs.promises.copyFile(filePath, newFilename);
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.log('error moving file', err);
  }
}

module.exports = {
  moveFile
}
