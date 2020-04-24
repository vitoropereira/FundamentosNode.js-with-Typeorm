import AppError from '../errors/AppError';
import { getCustomRepository } from "typeorm";

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Repository {
  id: string
}

class DeleteTransactionService {
  public async execute({ id }: Repository): Promise<Transaction | undefined> {
    // TODO
    try {
      const transactionsRepository = getCustomRepository(TransactionsRepository)
      const transactions = await transactionsRepository.findOne({
        where: { id }
      })

      if (transactions) {
        transactionsRepository.delete(transactions.id)

      }

      return transactions
    } catch (err) {
      throw new AppError('The transaction could not be deleted.', 400)
    }
  }
}

export default DeleteTransactionService
