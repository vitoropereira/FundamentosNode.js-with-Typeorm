import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface RepositoryDTO {
  title: string,
  value: number,
  type: "income" | "outcome",
  category: string,
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance({ title, value, type, category }: RepositoryDTO): Promise<Balance> {
    // TODO

    const { income, outcome } = (await this.find()).reduce((accumulator, transacition) => {
      switch (transacition.type) {
        case "income":
          accumulator.income += transacition.value
          break
        case "outcome":
          accumulator.outcome = + transacition.value;
          break
        default:
          break
      }
      return accumulator
    }, {
      income: 0,
      outcome: 0,
      total: 0
    })

    const total = income - outcome

    return {income, outcome, total}
  }
}

export default TransactionsRepository;
