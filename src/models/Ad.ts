// src/models/Ad.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
  title: string;
  type: 'image' | 'script';
  imageUrl?: string;
  scriptCode?: string;
  placement: 'top' | 'sidebar' | 'inline' | 'popup' | 'footer';
  redirectUrl?: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  createdAt: Date;
}

const AdSchema = new Schema<IAd>({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'script'],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  scriptCode: {
    type: String,
  },
  placement: {
    type: String,
    enum: ['top', 'sidebar', 'inline', 'popup', 'footer'],
    required: true,
  },
  redirectUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for placement queries
AdSchema.index({ placement: 1, isActive: 1, createdAt: -1 });

export const Ad = mongoose.model<IAd>('Ad', AdSchema);