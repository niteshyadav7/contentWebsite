// src/controllers/categories.controller.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CategoriesService } from '../services/categories.service';
import { logger } from '../utils/logger';

const categoriesService = new CategoriesService();

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});

export class CategoriesController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoriesService.getAll();
      res.json({ categories });
    } catch (error) {
      logger.error('Get categories error:', error);
      next(error);
    }
  }
  
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
      const category = await categoriesService.create(name);
      
      res.status(201).json({
        message: 'Category created successfully',
        category,
      });
    } catch (error) {
      logger.error('Create category error:', error);
      next(error);
    }
  }
  
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      const category = await categoriesService.update(id, name);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json({
        message: 'Category updated successfully',
        category,
      });
    } catch (error) {
      logger.error('Update category error:', error);
      next(error);
    }
  }
}
