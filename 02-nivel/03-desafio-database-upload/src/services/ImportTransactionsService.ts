/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { getRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

async function loadCSV(filePath: string): Promise<any[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(__dirname, `../../tmp/${filename}`);

    const data = await loadCSV(csvFilePath);

    const createTransactionService = new CreateTransactionService();
    const categoryRepository = getRepository(Category);

    const newTransactions: any = [];
    // title, type, value, category
    for (const transactionInfo of data) {
      const [title, type, value, category] = transactionInfo;
      const transaction = await createTransactionService.execute({
        title,
        type,
        value,
        category,
      });
      newTransactions.push(transaction);
    }

    const transactionsReponse: Array<any> = [];

    for (const transaction of newTransactions) {
      const [category] = await categoryRepository.find({
        where: { id: transaction.category_id },
      });
      delete transaction.category_id;
      transactionsReponse.push({ ...transaction, category });
    }

    return transactionsReponse;
  }
}

export default ImportTransactionsService;
