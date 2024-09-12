const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const activeFiles = new Set();

function createFileProcessor ({ watchDir, processAction }) {
  const emitter = new EventEmitter();

  function start () {
    fs.watch(watchDir, (eventType, filename) => {
      if (eventType === 'rename' && filename) {
        const filePath = path.join(watchDir, filename);

        if ( activeFiles.has(filePath) ) { return; }

        handleFileIfExists({ filePath, handler: () => {
          void processFile(filePath, filename);
        }});
      }
    });
    console.log("Watching files in:" + watchDir)
  }

  async function processFile (filePath, filename) {
    try {
      await processAction({ filename, filePath });
      emitter.emit('fileProcessed', filename);
    } catch (err) {
      emitter.emit('error', err);
    }
    activeFiles.delete(filePath);
  }

  return {
    start, 
    on: (event, callback) => emitter.on(event, callback),
    emit: (event, data) => emitter.emit(event, data)
  }
}

function handleFileIfExists ({ filePath, handler }) {
  if (path.basename(filePath) === '.DS_Store') { return; }

  activeFiles.add(filePath); 
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) { handler(); }
  });
}

module.exports = {
  createFileProcessor
}
