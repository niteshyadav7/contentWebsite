// src/services/ads.service.ts
import { Ad, IAd } from '../models/Ad';

export class AdsService {
  /**
   * Get active ads by placement
   */
  async getByPlacement(placement: string): Promise<IAd[]> {
    return await Ad.find({
      placement,
      isActive: true,
    }).sort({ createdAt: -1 });
  }
  
  /**
   * Get ad by ID
   */
  async getById(id: string): Promise<IAd | null> {
    return await Ad.findById(id);
  }
  
  /**
   * Create new ad
   */
  async create(adData: Partial<IAd>): Promise<IAd> {
    const ad = new Ad(adData);
    await ad.save();
    return ad;
  }
  
  /**
   * Update ad
   */
  async update(id: string, adData: Partial<IAd>): Promise<IAd | null> {
    const ad = await Ad.findById(id);
    if (!ad) {
      return null;
    }
    
    Object.assign(ad, adData);
    await ad.save();
    return ad;
  }
  
  /**
   * Delete ad
   */
  async delete(id: string): Promise<boolean> {
    const result = await Ad.findByIdAndDelete(id);
    return !!result;
  }
}
