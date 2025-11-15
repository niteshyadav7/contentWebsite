// src/routes/metrics.routes.ts
import { Router } from 'express';
import { MetricsController, metricsSchema } from '../controllers/metrics.controller';
import { validate } from '../middleware/validate.middleware';
import { metricsLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
const metricsController = new MetricsController();

/**
 * @route   POST /api/metrics/impression
 * @desc    Record ad impression
 * @access  Public
 */
router.post(
  '/impression',
  metricsLimiter,
  validate(metricsSchema),
  metricsController.recordImpression.bind(metricsController)
);

/**
 * @route   POST /api/metrics/click
 * @desc    Record ad click
 * @access  Public
 */
router.post(
  '/click',
  metricsLimiter,
  validate(metricsSchema),
  metricsController.recordClick.bind(metricsController)
);

export default router;