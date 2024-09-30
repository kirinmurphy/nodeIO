import path from 'path';
import csv from 'csv-parser';
import { NORMALIZED_HEADERS, preprocessCSV } from './preprocessCSV.js';

const CURRENCY_LABEL = "Cur.";

const CT_HEADER_MAP = {
  "Date": NORMALIZED_HEADERS.date,
  "Type": NORMALIZED_HEADERS.type,
  "Buy": NORMALIZED_HEADERS.buy_amount,
  "Sell": NORMALIZED_HEADERS.sell_amount,
  "Fee": NORMALIZED_HEADERS.fee_amount,
  [CURRENCY_LABEL]: [
    NORMALIZED_HEADERS.buy_currency,
    NORMALIZED_HEADERS.sell_currency,
    NORMALIZED_HEADERS.fee_currency
  ],
  "Tx-ID": NORMALIZED_HEADERS.transaction_id,
  "Exchange": NORMALIZED_HEADERS.exchange,
  "Group": NORMALIZED_HEADERS.group,
  "Comment": NORMALIZED_HEADERS.comment
}

export async function preprocessCB (props) {
  const { 
    filename, 
    filePath: inputFile, 
    processedDir, 
  } = props;

  let newHeadersMap = [];

  // CB has 3 fields that are all called currency
  let currencyFieldCounter = 0;

  const outputFile = path.join(processedDir, filename);

  const csvParser = csv({
    mapHeaders: ({ header, index }) => {
      const isCurrencyField = header === CURRENCY_LABEL;
      const newHeader = isCurrencyField 
        ? CT_HEADER_MAP[header][currencyFieldCounter] 
        : CT_HEADER_MAP[header] || header;
    
      if ( isCurrencyField ) { currencyFieldCounter++; }

      newHeadersMap[index] = newHeader;
      return newHeader;
    },
    
  });

  preprocessCSV({ inputFile, outputFile, csvParser, newHeadersMap });
}
