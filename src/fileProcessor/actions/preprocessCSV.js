import fs from 'fs';
import { once } from 'events';
import { createObjectCsvWriter } from 'csv-writer';

export async function preprocessCSV ({ inputFile, outputFile, csvParser, newHeadersMap }) {
  let rows = [];

  const readStream = fs.createReadStream(inputFile, 'utf8').pipe(csvParser);

  readStream.on('data', chunk => {
    rows.push(chunk);
  });

  try {
    await once(readStream, 'end');
    console.log(`Finished reading ${inputFile}`);

    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: newHeadersMap.map(header => ({ id: header, title: header }))
    });

    await csvWriter.writeRecords(rows);
    console.log('CSV file successfully processed and saved as', outputFile);
  } catch (err) {
    console.error('Error writing CSV file: ', err)
  }
}
