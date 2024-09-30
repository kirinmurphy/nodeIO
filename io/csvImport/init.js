import { getDirname, createDir } from '../../src/utils/createDir.js';
import { createFileProcessor } from '../../src/fileProcessor/createFileProcessor.js';
import { moveFile } from '../../src/fileProcessor/actions/moveFile.js';
import { removeFile } from '../../src/fileProcessor/actions/removeFile.js';
import { preprocessCT } from './preprocessCT.js';
import { importCSV } from './importCSV.js';

const __dirname = getDirname(import.meta.url);
const watchDir = createDir(__dirname, ['temp', 'watch']);
const processedDir = createDir(__dirname, ['temp', 'processed']);
const movedDir = createDir(__dirname, ['temp', 'processed', 'orig']);

const ioName = 'Csv Import';

const csvImporter = createFileProcessor({ 
  watchDir, 
  processAction: async ({ filename, filePath }) => {
    try {
      const preprocessedFile = await preprocessCT({ filename, filePath, processedDir });
      await importCSV({ filePath: preprocessedFile });
      void removeFile({ filePath: preprocessedFile });
      void moveFile({ filename, filePath, processedDir: movedDir });
    } catch (err) {
      console.error(err);
    }
  }
})

csvImporter.on('fileProcessed', (filename) => {
  console.log(`\n${ioName} file processed: ${filename}`);
});

csvImporter.on('error', (error) => {
  console.error(`\n${ioName} file processor error:`, error);
})

csvImporter.start(); 

process.on('SIGINT', () => {
  console.log(`\nShutting down ${ioName }file processor...`);
  process.exit(0);
});
