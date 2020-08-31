/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';

import config from '../config/upload';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

interface ListTransactionsResponse {
  id: string;
  title: string;
  type: string;
  value: number;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

const upload = multer(config.upload);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoryRepository = getRepository(Category);

  const tempTransactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  const transactions: Array<ListTransactionsResponse> = [];

  for (const transaction of tempTransactions) {
    const [category] = await categoryRepository.find({
      where: { id: transaction.category_id },
    });
    delete transaction.category_id;
    transactions.push({ ...transaction, category });
  }

  return response.status(200).json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTrasactionService = new DeleteTransactionService();

  await deleteTrasactionService.execute(id);

  return response.json({ message: 'deleted successfully' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(
      request.file.filename,
    );

    return response.json(transactions);
  },
);

export default transactionsRouter;
