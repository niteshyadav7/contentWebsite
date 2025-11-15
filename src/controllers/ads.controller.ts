// src/controllers/ads.controller.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AdsService } from '../services/ads.service';
import { logger } from '../utils/logger';

const adsService = new AdsService();

export const createAdSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid('image', 'script').required(),
  imageUrl: Joi.string().uri().when('type', { is: 'image', then: Joi.required() }),
  scriptCode: Joi.string().when('type', { is: 'script', then: Joi.required() }),
  placement: Joi.string().valid('top', 'sidebar', 'inline', 'popup', 'footer').required(),
  redirectUrl: Joi.string().uri().optional(),
  isActive: Joi.boolean().default(true),
});

export const updateAdSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  type: Joi.string().valid('image', 'script').optional(),
  imageUrl: Joi.string().uri().optional(),
  scriptCode: Joi.string().optional(),
  placement: Joi.string().valid('top', 'sidebar', 'inline', 'popup', 'footer').optional(),
  redirectUrl: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
});

export class AdsController {
  async getByPlacement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { placement } = req.query;
      
      if (!placement) {
        res.status(400).json({ error: 'Placement query parameter required' });
        return;
      }
      
      const ads = await adsService.getByPlacement(placement as string);
      res.json({ ads });
    } catch (error) {
      logger.error('Get ads error:', error);
      next(error);
    }
  }
  
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ad = await adsService.create(req.body);
      
      res.status(201).json({
        message: 'Ad created successfully',
        ad,
      });
    } catch (error) {
      logger.error('Create ad error:', error);
      next(error);
    }
  }
  
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const ad = await adsService.update(id, req.body);
      
      if (!ad) {
        res.status(404).json({ error: 'Ad not found' });
        return;
      }
      
      res.json({
        message: 'Ad updated successfully',
        ad,
      });
    } catch (error) {
      logger.error('Update ad error:', error);
      next(error);
    }
  }
  
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await adsService.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Ad not found' });
        return;
      }
      
      res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
      logger.error('Delete ad error:', error);
      next(error);
    }
  }
}

// ===================================================================
