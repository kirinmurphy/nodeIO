import { getDirname, createDir } from '../../src/utils/createDir.js';
import { createFileProcessor } from '../../src/fileProcessor/createFileProcessor.js';
import { moveFile } from '../../src/fileProcessor/actions/moveFile.js';
import { convertWavToMp3 } from '../../src/fileProcessor/actions/convertWavToMp3.js';

// TODO: make configurable from the command line 
const __dirname = getDirname(import.meta.url);
const watchDir = createDir(__dirname, ['temp', 'watch']);
const processedDir = createDir(__dirname, ['temp', 'processed']);
const movedDir = createDir(__dirname, ['temp', 'processed', 'orig']);

const ioName = 'MP3 Converter';

const mp3Converter = createFileProcessor({ 
  watchDir, 
  processAction: async ({ filename, filePath }) => {
    try {
      await convertWavToMp3({ filename, filePath, processedDir });
      await moveFile({ filename, filePath, processedDir: movedDir });
    } catch (err) {
      console.error(err);
    }
  }
});

mp3Converter.on('fileProcessed', (filename) => {
  console.log(`\n${ioName} file processed: ${filename}`);
});

mp3Converter.on('error', (error) => {
  console.error(`\n${ioName} file processor error:`, error);
});

mp3Converter.start(); 

process.on('SIGINT', () => {
  console.log(`\nShutting down ${ioName} file processor...`);
  process.exit(0);
});
