import AppError from '../errors/AppError';
import { getCustomRepository } from "typeorm";

import Transaction from '../models/Transaction';
import CategoriesReposirory from '../repositories/CategoriesRepository'
import TransactionsReposirory from '../repositories/TransactionsRepository'


interface Repository {
  title: string,
  value: number,
  type: "income" | "outcome",
  category: string,
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Repository): Promise<Transaction> {
    // TODO
    const categoriesReposirory = getCustomRepository(CategoriesReposirory)
    const findCategories = await categoriesReposirory.findOne({
      where: { title: category },
    })
    /**
     * parei tentando visualizar todas as categorias.....
     */
    // if (!findCategories) {
    //   console.log('--->>>')
    //   const createCategory = await this.create({
    //     title: category
    //   })

    //   await this.save(createCategory)
    //   return createCategory
    // }

    return findCategories


    // if (!categoriesRepository) {
    //   throw new AppError('Error with the categories type.', 400)
    // }

    // const categoryId = categoriesRepository.findOne({
    //   where: { title: category },
    // })
    // const transactionsRepository = getCustomRepository(TransactionsReposirory)

    // if (!transactionsRepository) {
    //   throw new AppError('Error creating a transaction.', 400)
    // }

    // const transaction = transactionsRepository.create({
    //   title,
    //   value,
    //   type,
    //   category_id = categoriesRepository.getId()
    // })

    // await appointmentsRepository.save(appointment)

    // await this.save(createCategory)
    // return createCategory


  }
}

export default CreateTransactionService;
