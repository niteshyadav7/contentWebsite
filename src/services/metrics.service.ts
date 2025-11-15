// src/services/metrics.service.ts
import { Ad } from '../models/Ad';

export class MetricsService {
  /**
   * Record ad impression (atomic increment)
   */
  async recordImpression(adId: string): Promise<void> {
    await Ad.findByIdAndUpdate(adId, { $inc: { impressions: 1 } });
  }
  
  /**
   * Record ad click (atomic increment)
   */
  async recordClick(adId: string): Promise<void> {
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
  }
  
  /**
   * Get ad metrics
   */
  async getAdMetrics(adId: string): Promise<{ impressions: number; clicks: number; ctr: number } | null> {
    const ad = await Ad.findById(adId);
    if (!ad) {
      return null;
    }
    
    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
    
    return {
      impressions: ad.impressions,
      clicks: ad.clicks,
      ctr: parseFloat(ctr.toFixed(2)),
    };
  }
}