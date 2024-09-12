const fs = require('fs');

async function removeFile ({ filePath }) {
  await fs.promises.unlink(filePath);
}

module.exports = {
  removeFile
}