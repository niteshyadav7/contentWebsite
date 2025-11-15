// src/routes/public.routes.ts
import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { CategoriesController } from '../controllers/categories.controller';
import { AdsController } from '../controllers/ads.controller';

const router = Router();
const postsController = new PostsController();
const categoriesController = new CategoriesController();
const adsController = new AdsController();

/**
 * @route   GET /api/posts
 * @desc    Get paginated posts with filters
 * @access  Public
 */
router.get('/posts', postsController.getAll.bind(postsController));

/**
 * @route   GET /api/posts/:slug
 * @desc    Get post by slug
 * @access  Public
 */
router.get('/posts/:slug', postsController.getBySlug.bind(postsController));

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/categories', categoriesController.getAll.bind(categoriesController));

/**
 * @route   GET /api/ads
 * @desc    Get ads by placement
 * @access  Public
 */
router.get('/ads', adsController.getByPlacement.bind(adsController));

export default router;