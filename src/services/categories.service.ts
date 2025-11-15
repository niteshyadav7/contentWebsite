// src/services/categories.service.ts
import { Category, ICategory } from '../models/Category';
import { generateUniqueSlug } from '../utils/slugify';

export class CategoriesService {
  /**
   * Get all categories
   */
  async getAll(): Promise<ICategory[]> {
    return await Category.find().sort({ createdAt: -1 });
  }
  
  /**
   * Get category by ID
   */
  async getById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }
  
  /**
   * Create new category
   */
  async create(name: string): Promise<ICategory> {
    const slug = await generateUniqueSlug(name, Category);
    
    const category = new Category({
      name,
      slug,
    });
    
    await category.save();
    return category;
  }
  
  /**
   * Update category
   */
  async update(id: string, name: string): Promise<ICategory | null> {
    const category = await Category.findById(id);
    if (!category) {
      return null;
    }
    
    category.name = name;
    category.slug = await generateUniqueSlug(name, Category, id);
    
    await category.save();
    return category;
  }
}