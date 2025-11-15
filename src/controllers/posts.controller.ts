// src/controllers/posts.controller.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { PostsService } from '../services/posts.service';
import { logger } from '../utils/logger';

const postsService = new PostsService();

export const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(20).required(),
  thumbnailUrl: Joi.string().uri().optional(),
  category: Joi.string().required(),
  metaTitle: Joi.string().max(60).optional(),
  metaDescription: Joi.string().max(160).optional(),
  published: Joi.boolean().default(false),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  content: Joi.string().min(20).optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  metaTitle: Joi.string().max(60).optional(),
  metaDescription: Joi.string().max(160).optional(),
  published: Joi.boolean().optional(),
});

export class PostsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const published = req.query.published === 'true' ? true : undefined;
      
      const result = await postsService.getAll(
        { category, search, published },
        { page, limit }
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Get posts error:', error);
      next(error);
    }
  }
  
  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await postsService.getBySlug(slug);
      
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      res.json({ post });
    } catch (error) {
      logger.error('Get post error:', error);
      next(error);
    }
  }
  
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postsService.create(req.body);
      
      res.status(201).json({
        message: 'Post created successfully',
        post,
      });
    } catch (error) {
      logger.error('Create post error:', error);
      next(error);
    }
  }
  
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const post = await postsService.update(id, req.body);
      
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      res.json({
        message: 'Post updated successfully',
        post,
      });
    } catch (error) {
      logger.error('Update post error:', error);
      next(error);
    }
  }
  
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await postsService.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      logger.error('Delete post error:', error);
      next(error);
    }
  }
}
