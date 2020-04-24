import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from "typeorm";

import Transaction from '../models/Transaction';
import CategoriesReposirory from '../repositories/CategoriesRepository'
import TransactionsReposirory from '../repositories/TransactionsRepository'
import Category from '../models/Category';

interface Repository {
  title: string,
  value: number,
  type: "income" | "outcome",
  category: string,
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Repository): Promise<Transaction> {
    // Outro jeito
    const categoriesReposirory = getRepository(Category)

    let transactionCategory = await categoriesReposirory.findOne({
      where: { title: category }
    })

    if(!transactionCategory){
      transactionCategory = categoriesReposirory.create({
        title: category,
      })
      await categoriesReposirory.save(transactionCategory)
    }

    // MEU JEITO
    // if (type !== "outcome" && type !== "income") {
    //   throw new AppError('As a type, use only "income" or "outcome".', 400)
    // }

    // const categoriesReposirory = getCustomRepository(CategoriesReposirory)

    // const findCategories = await categoriesReposirory.getCategory(category)

    // if (!findCategories) {
    //   throw new AppError('Error with the categories type.', 400)
    // }

    const transactionsRepository = getCustomRepository(TransactionsReposirory)

    if (!transactionsRepository) {
      throw new AppError('Error creating a transaction.', 400)
    }

    const balance = transactionsRepository.getBalance()
    const totalBalance = (await balance).total

    if (type === "outcome") {
      if (totalBalance < value) {
        throw new AppError(`You don´t have enough balance. ${totalBalance}`, 400)
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
