// src/utils/slugify.ts
import slugifyLib from 'slugify';

/**
 * Generate URL-friendly slug from text
 */
export const slugify = (text: string): string => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate unique slug by appending counter if needed
 */
export const generateUniqueSlug = async (
  text: string,
  Model: any,
  excludeId?: string
): Promise<string> => {
  let slug = slugify(text);
  let counter = 1;
  
  while (true) {
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existing = await Model.findOne(query);
    
    if (!existing) {
      return slug;
    }
    
    slug = `${slugify(text)}-${counter}`;
    counter++;
  }
};