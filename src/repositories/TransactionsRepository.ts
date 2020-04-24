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
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find()

    const { income, outcome } = transactions.reduce(
      (accumulator, transacition) => {
      switch (transacition.type) {
        case "income":
          accumulator.income = Number(accumulator.income + transacition.value)
          break
        case "outcome":
          accumulator.outcome = Number(accumulator.outcome + transacition.value)
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

    // // usando filtro
    // let income = 0;
    // let outcome = 0;
    // let total = 0;
    // const repositories = await this.find()

    // repositories.map(transaction => {
    //   if (transaction.type === 'income') {
    //     income = income + transaction.value
    //   } else {
    //     outcome = outcome + transaction.value
    //   }
    // })

    const total = income - outcome

    return { income, outcome, total }
  }

}

export default TransactionsRepository;
