import { getRepository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

type CreateTransactionRequest = {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
};

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionRequest): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let newCategory: Category;
    const existingCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (existingCategory) {
      newCategory = existingCategory;
    } else {
      newCategory = await categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0)
      throw new AppError('Not enough cash', 400);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
