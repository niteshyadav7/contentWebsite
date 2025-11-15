// src/controllers/metrics.controller.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { MetricsService } from '../services/metrics.service';
import { logger } from '../utils/logger';

const metricsService = new MetricsService();

export const metricsSchema = Joi.object({
  adId: Joi.string().required(),
});

export class MetricsController {
  async recordImpression(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { adId } = req.body;
      await metricsService.recordImpression(adId);
      
      res.json({ message: 'Impression recorded' });
    } catch (error) {
      logger.error('Record impression error:', error);
      next(error);
    }
  }
  
  async recordClick(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { adId } = req.body;
      await metricsService.recordClick(adId);
      
      res.json({ message: 'Click recorded' });
    } catch (error) {
      logger.error('Record click error:', error);
      next(error);
    }
  }
  
  async getAdMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const metrics = await metricsService.getAdMetrics(id);
      
      if (!metrics) {
        res.status(404).json({ error: 'Ad not found' });
        return;
      }
      
      res.json({ metrics });
    } catch (error) {
      logger.error('Get metrics error:', error);
      next(error);
    }
  }
}