import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';


export function preprocessCSV ({ inputFile, outputFile, csvParser, newHeadersMap }) {
  let rows = [];

  fs.createReadStream(inputFile, 'utf8')
    .pipe(csvParser)
    .on('data', chunk => {
      rows.push(chunk);
    })
    .on('end', () => {
      console.log('Finished reading this file.');
      const csvWriter = createObjectCsvWriter({
        path: outputFile,
        header: newHeadersMap.map(header => ({ id: header, title: header }))
      });

      csvWriter.writeRecords(rows)
        .then(() => {
          console.log('CSV file successfully processed and saved as', outputFile);
        })
        .catch(err => console.error('Error writing CSV file: ', err));
    })
    .on('error', (err) => {
      console.error('Error reading teh file:', err);
    });
}
