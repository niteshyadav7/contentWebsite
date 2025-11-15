// tests/posts.test.ts
import { PostsService } from '../src/services/posts.service';
import { Post } from '../src/models/Post';

jest.mock('../src/models/Post');
jest.mock('../src/utils/slugify');

describe('PostsService', () => {
  let postsService: PostsService;
  
  beforeEach(() => {
    postsService = new PostsService();
    jest.clearAllMocks();
  });
  
  describe('getAll', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [
        { _id: '1', title: 'Post 1', slug: 'post-1' },
        { _id: '2', title: 'Post 2', slug: 'post-2' },
      ];
      
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPosts),
      };
      
      (Post.find as jest.Mock).mockReturnValue(mockQuery);
      (Post.countDocuments as jest.Mock).mockResolvedValue(10);
      
      const result = await postsService.getAll(
        { published: true },
        { page: 1, limit: 10 }
      );
      
      expect(result.posts).toEqual(mockPosts);
      expect(result.total).toBe(10);
      expect(result.pages).toBe(1);
    });
  });
  
  describe('create', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test content',
        category: 'cat123',
        published: true,
      };
      
      const mockPost = {
        ...postData,
        _id: 'post123',
        slug: 'test-post',
        save: jest.fn(),
      };
      
      (Post as any).mockImplementation(() => mockPost);
      
      const result = await postsService.create(postData);
      
      expect(mockPost.save).toHaveBeenCalled();
    });
  });
});