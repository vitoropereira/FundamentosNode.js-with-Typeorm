import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Repository {
  title: string,
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getBalance(category: Repository) {
    // TODO
    const categories = await this.find()

    return categories
  }
}

export default CategoriesRepository;
