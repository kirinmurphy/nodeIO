import { createFileProcessor } from './createFileProcessor.js';
import { moveFile } from './actions/moveFile.js';
import { preprocessCB } from '../csvImporter/preprocessCB.js';
import { getDirname, createDir } from './utils/createDir.js';

// TODO: make configurable from the command line 
const __dirname = getDirname(import.meta.url);
const watchDir = createDir(__dirname, ['watch']);
const processedDir = createDir(__dirname, ['processed']);
const movedDir = createDir(__dirname, ['processed', 'orig']);

const fileProcessor = createFileProcessor({ 
  watchDir, 
  processAction: async ({ filename, filePath }) => {
    try {
      await preprocessCB({ filename, filePath, processedDir });
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
