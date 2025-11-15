// scripts/seed.ts
import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../src/utils/db';
import { User } from '../src/models/User';
import { Category } from '../src/models/Category';
import { Post } from '../src/models/Post';
import { Ad } from '../src/models/Ad';
import bcrypt from 'bcrypt';
import { logger } from '../src/utils/logger';

const seed = async () => {
  try {
    await connectDB();
    logger.info('Starting database seed...');
    
    // Create admin user
    const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin123!';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      logger.info(`Admin user already exists: ${adminEmail}`);
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      
      const admin = new User({
        email: adminEmail,
        passwordHash,
        name: 'Admin User',
        role: 'admin',
      });
      
      await admin.save();
      logger.info(`Admin user created: ${adminEmail}`);
      logger.info(`Password: ${adminPassword}`);
    }
    
    // Create sample categories
    const categories = [
      { name: 'Technology', slug: 'technology' },
      { name: 'Business', slug: 'business' },
      { name: 'Lifestyle', slug: 'lifestyle' },
      { name: 'Entertainment', slug: 'entertainment' },
    ];
    
    for (const catData of categories) {
      const existing = await Category.findOne({ slug: catData.slug });
      if (!existing) {
        await Category.create(catData);
        logger.info(`Category created: ${catData.name}`);
      }
    }
    
    // Create sample post
    const techCategory = await Category.findOne({ slug: 'technology' });
    
    if (techCategory) {
      const existingPost = await Post.findOne({ slug: 'welcome-to-our-blog' });
      
      if (!existingPost) {
        const post = new Post({
          title: 'Welcome to Our Blog',
          slug: 'welcome-to-our-blog',
          content: `
            <h2>Welcome to Our Content Platform</h2>
            <p>This is a sample blog post to demonstrate the content management system.</p>
            <p>The platform supports rich HTML content, categories, SEO metadata, and more.</p>
            <h3>Features Include:</h3>
            <ul>
              <li>Full content management with WYSIWYG support</li>
              <li>Category organization</li>
              <li>SEO-friendly URLs and metadata</li>
              <li>Ad management and tracking</li>
              <li>Responsive design</li>
            </ul>
          `,
          thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
          category: techCategory._id,
          metaTitle: 'Welcome to Our Blog - Latest Tech News',
          metaDescription: 'Discover the latest technology news and insights on our platform.',
          published: true,
        });
        
        await post.save();
        logger.info('Sample post created');
      }
    }
    
    // Create sample ads
    const sampleAds = [
      {
        title: 'Top Banner Ad',
        type: 'image' as const,
        imageUrl: 'https://via.placeholder.com/728x90/0066cc/ffffff?text=Advertisement',
        placement: 'top' as const,
        redirectUrl: 'https://example.com',
        isActive: true,
      },
      {
        title: 'Sidebar Ad',
        type: 'image' as const,
        imageUrl: 'https://via.placeholder.com/300x250/ff6600/ffffff?text=Sidebar+Ad',
        placement: 'sidebar' as const,
        redirectUrl: 'https://example.com',
        isActive: true,
      },
    ];
    
    for (const adData of sampleAds) {
      const existing = await Ad.findOne({ title: adData.title });
      if (!existing) {
        await Ad.create(adData);
        logger.info(`Ad created: ${adData.title}`);
      }
    }
    
    logger.info('Database seed completed successfully!');
    logger.info('-----------------------------------');
    logger.info(`Admin Email: ${adminEmail}`);
    logger.info(`Admin Password: ${adminPassword}`);
    logger.info('-----------------------------------');
    
  } catch (error) {
    logger.error('Seed failed:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
};

seed();