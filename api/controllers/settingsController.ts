import type { Request, Response } from 'express';
import { getSettings, updateSettings } from '../services/dataStore.js';
import { Settings } from '../../shared/types.js';

export async function get(req: Request, res: Response) {
  try {
    const settings = getSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('获取设置错误:', error);
    res.status(500).json({
      success: false,
      error: '获取设置失败',
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const settings: Partial<Settings> = req.body;
    const updated = updateSettings(settings);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('更新设置错误:', error);
    res.status(500).json({
      success: false,
      error: '更新设置失败',
    });
  }
}
