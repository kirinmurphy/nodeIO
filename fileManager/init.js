const fs = require('fs');
const path = require('path');
const { createFileProcessor } = require('./createFileProcessor');
const { convertWavToMp3 } = require('./actions/convertWavToMp3');
const { moveFile } = require('./actions/moveFile');

const watchDir = createDir(['watch']);
const processedDir = createDir(['processed']);
const movedDir = createDir(['processed', 'orig']);

const fileProcessor = createFileProcessor({ 
  watchDir, 
  processAction: async ({ filename, filePath }) => {
    await convertWavToMp3({ filename, watchDir, processedDir: processedDir });
    await moveFile({ filename, filePath, processedDir: movedDir });
  }
});

fileProcessor.on('fileProcessed', (filename) => {
  console.log(`\nFile processed: ${filename}`);
});

// observe 
fileProcessor.on('error', (error) => {
  console.error('\nFile processor error:', error);
});

// init
fileProcessor.start(); 

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down file processor...');
  // Perform any necessary cleanup here
  process.exit(0);
});

function createDir (folderNames) {
  const fileDestination = path.join(__dirname, ...folderNames);
  fs.mkdirSync(fileDestination, { recursive: true });  
  return fileDestination
}
