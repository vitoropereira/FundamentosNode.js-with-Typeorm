import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getCategory(category: string) {
    // TODO

    const categories = await this.findOne({
      where: { title: category }
    })

    if (categories == null) {
      const createCategory = this.create({
        title: category
      })
      await this.save(createCategory)
      return createCategory
    }

    return categories
  }
}

export default CategoriesRepository;
