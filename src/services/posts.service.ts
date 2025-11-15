// src/services/posts.service.ts
import { Post, IPost } from '../models/Post';
import { generateUniqueSlug } from '../utils/slugify';

export interface PostFilters {
  category?: string;
  search?: string;
  published?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export class PostsService {
  /**
   * Get paginated posts with filters
   */
  async getAll(
    filters: PostFilters,
    pagination: PaginationOptions
  ): Promise<{ posts: IPost[]; total: number; pages: number }> {
    const query: any = {};
    
    if (filters.published !== undefined) {
      query.published = filters.published;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    const skip = (pagination.page - 1) * pagination.limit;
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pagination.limit),
      Post.countDocuments(query),
    ]);
    
    const pages = Math.ceil(total / pagination.limit);
    
    return { posts, total, pages };
  }
  
  /**
   * Get post by slug
   */
  async getBySlug(slug: string): Promise<IPost | null> {
    return await Post.findOne({ slug }).populate('category');
  }
  
  /**
   * Get post by ID
   */
  async getById(id: string): Promise<IPost | null> {
    return await Post.findById(id).populate('category');
  }
  
  /**
   * Create new post
   */
  async create(postData: Partial<IPost>): Promise<IPost> {
    const slug = await generateUniqueSlug(postData.title!, Post);
    
    const post = new Post({
      ...postData,
      slug,
    });
    
    await post.save();
    return post;
  }
  
  /**
   * Update post
   */
  async update(id: string, postData: Partial<IPost>): Promise<IPost | null> {
    const post = await Post.findById(id);
    if (!post) {
      return null;
    }
    
    Object.assign(post, postData);
    
    if (postData.title) {
      post.slug = await generateUniqueSlug(postData.title, Post, id);
    }
    
    await post.save();
    return post;
  }
  
  /**
   * Delete post
   */
  async delete(id: string): Promise<boolean> {
    const result = await Post.findByIdAndDelete(id);
    return !!result;
  }
}
