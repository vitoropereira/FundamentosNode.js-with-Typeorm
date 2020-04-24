import Transaction from '../models/Transaction';
import fs from 'fs'
import path from 'path'
import csv from 'csv-parse'
import CreateTransactionService from '../services/CreateTransactionService';
import AppError from '../errors/AppError';
import { getCustomRepository, In } from "typeorm";
import parse from 'csv-parse';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

interface transactionRow {
  title: string,
  value: number,
  type: "income" | "outcome",
  category: string,
}

// interface UserDetailsRow {
//   id: number;
//   firstName: string;
//   lastName: string;
//   address: string;
//   // properties from user
//   isVerified: boolean;
//   hasLoggedIn: boolean;
//   age: number;
// }


class ImportTransactionsService {
  async execute(): Promise<Transaction[] | any> {
    // TODO
    const categoriesRepository = getCustomRepository(CategoriesRepository)
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const pathFile = path.resolve(__dirname, '..', '..', 'tmp', 'file.csv')

    const stream = fs.createReadStream(pathFile)

    const parsers = csv({
      from_line: 2
    })

    const parseCSV = stream.pipe(parsers)

    const transactions: transactionRow[] = []
    const categories: string[] = []

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
      )

      if (!title || !value || !type) return

      categories.push(category)
      transactions.push({ title, type, value, category })
    })

    await new Promise(resolve => parseCSV.on('end', resolve))

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    })

    const existentCategoriesTitle = existentCategories.map(
       (category: Category) => category.title
    )

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitle
        .includes(category))
      .filter((value, index, self) => self
        .indexOf(value) === index)

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title
      }))
    )

    await categoriesRepository.save(newCategories)

    const finalCategories = [...newCategories, ...existentCategories]

    const createdTransacrions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category
        ),
      }))
    )

    await transactionsRepository.save(createdTransacrions)

    // await fs.promises.unlink(pathFile) deleta o artquivo

    return createdTransacrions

  }
}


export default ImportTransactionsService;
