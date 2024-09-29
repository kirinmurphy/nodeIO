import fs from 'fs';
import path from 'path';
import { createFileProcessor } from './createFileProcessor.js';
import { convertWavToMp3 } from './actions/convertWavToMp3.js';
import { moveFile } from './actions/moveFile.js';
import { fileURLToPath } from 'url';


const __dirname = getDirname();
// TODO: make configurable from the command line 
const watchDir = createDir(['watch']);
const processedDir = createDir(['processed']);
const movedDir = createDir(['processed', 'orig']);

const fileProcessor = createFileProcessor({ 
  watchDir, 
  processAction: async ({ filename, filePath }) => {
    try {
      await convertWavToMp3({ filename, watchDir, processedDir });
      await moveFile({ filename, filePath, processedDir: movedDir });
    } catch (err) {
      console.error(err);
    }
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

function getDirname () {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);    
}
