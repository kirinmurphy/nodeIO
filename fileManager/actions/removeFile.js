import fs from 'fs';

export async function removeFile ({ filePath }) {
  await fs.promises.unlink(filePath);
}
