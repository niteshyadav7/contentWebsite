// src/routes/admin.routes.ts
import { Router } from "express";
import {
  PostsController,
  createPostSchema,
  updatePostSchema,
} from "../controllers/posts.controller";
import {
  CategoriesController,
  categorySchema,
} from "../controllers/categories.controller";
import {
  AdsController,
  createAdSchema,
  updateAdSchema,
} from "../controllers/ads.controller";
// thhis 
import { MetricsController } from "../controllers/metrics.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(requireAdmin);

const postsController = new PostsController();
const categoriesController = new CategoriesController();
const adsController = new AdsController();
const metricsController = new MetricsController();

// ===== Posts Routes =====
/**
 * @route   POST /api/admin/posts
 * @desc    Create new post
 * @access  Admin
 */
router.post(
  "/posts",
  validate(createPostSchema),
  postsController.create.bind(postsController)
);

/**
 * @route   PUT /api/admin/posts/:id
 * @desc    Update post
 * @access  Admin
 */
router.put(
  "/posts/:id",
  validate(updatePostSchema),
  postsController.update.bind(postsController)
);

/**
 * @route   DELETE /api/admin/posts/:id
 * @desc    Delete post
 * @access  Admin
 */
router.delete("/posts/:id", postsController.delete.bind(postsController));

// ===== Categories Routes =====
/**
 * @route   POST /api/admin/categories
 * @desc    Create new category
 * @access  Admin
 */
router.post(
  "/categories",
  validate(categorySchema),
  categoriesController.create.bind(categoriesController)
);

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category
 * @access  Admin
 */
router.put(
  "/categories/:id",
  validate(categorySchema),
  categoriesController.update.bind(categoriesController)
);

// ===== Ads Routes =====
/**
 * @route   POST /api/admin/ads
 * @desc    Create new ad
 * @access  Admin
 */
router.post(
  "/ads",
  validate(createAdSchema),
  adsController.create.bind(adsController)
);

/**
 * @route   PUT /api/admin/ads/:id
 * @desc    Update ad
 * @access  Admin
 */
router.put(
  "/ads/:id",
  validate(updateAdSchema),
  adsController.update.bind(adsController)
);

/**
 * @route   DELETE /api/admin/ads/:id
 * @desc    Delete ad
 * @access  Admin
 */
router.delete("/ads/:id", adsController.delete.bind(adsController));

// ===== Metrics Routes =====
/**
 * @route   GET /api/admin/metrics/ad/:id
 * @desc    Get ad metrics
 * @access  Admin
 */
router.get(
  "/metrics/ad/:id",
  metricsController.getAdMetrics.bind(metricsController)
);

export default router;
