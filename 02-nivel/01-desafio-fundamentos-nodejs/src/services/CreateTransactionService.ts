import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

type CreateTransactionRequest = {
  title: string;
  value: number;
  type: 'income' | 'outcome';
};

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({
    title,
    value,
    type,
  }: CreateTransactionRequest): Transaction {
    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0)
      throw Error('Not enough cash');

    return this.transactionsRepository.create({
      title,
      value,
      type,
    });
  }
}

export default CreateTransactionService;
