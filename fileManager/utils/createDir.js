import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function createDir (dirName, folderNames) {
  const fileDestination = path.join(dirName, ...folderNames);
  fs.mkdirSync(fileDestination, { recursive: true });  
  return fileDestination;
}

export function getDirname (url) {
  const __filename = fileURLToPath(url);
  return path.dirname(__filename);    
}
