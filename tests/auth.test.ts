// tests/auth.test.ts
import { AuthService } from '../src/services/auth.service';
import { User } from '../src/models/User';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../src/models/User');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });
  
  describe('register', () => {
    it('should create a new admin user', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        save: jest.fn(),
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User as any).mockImplementation(() => mockUser);
      
      const result = await authService.register('test@example.com', 'password123', 'Test User');
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.save).toHaveBeenCalled();
    });
    
    it('should throw error if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
      
      await expect(
        authService.register('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('User already exists');
    });
  });
  
  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        passwordHash: 'hashedPassword',
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const result = await authService.login('test@example.com', 'password123');
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
    });
    
    it('should throw error for invalid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
