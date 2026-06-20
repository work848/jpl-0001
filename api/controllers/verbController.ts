import type { Request, Response } from 'express';
import { conjugateVerb } from '../services/verbConjugation.js';
import {
  getAllVerbs,
  addVerb,
  deleteVerb,
  hideVerb,
} from '../services/dataStore.js';
import { VerbConjugateRequest, VerbConjugateResponse } from '../../shared/types.js';

export async function conjugate(req: Request, res: Response) {
  try {
    const { word, type, forms }: VerbConjugateRequest = req.body;

    if (!word || !type || !forms) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数：word、type、forms',
      });
      return;
    }

    const results = conjugateVerb(word, type, forms);

    const response: VerbConjugateResponse = {
      word,
      type,
      results,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('动词变形错误:', error);
    res.status(500).json({
      success: false,
      error: '动词变形失败',
    });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const verbs = getAllVerbs();
    res.status(200).json({
      success: true,
      data: verbs,
    });
  } catch (error) {
    console.error('获取动词列表错误:', error);
    res.status(500).json({
      success: false,
      error: '获取动词列表失败',
    });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { word, type } = req.body;

    if (!word || !type) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数：word、type',
      });
      return;
    }

    const verb = addVerb(word, type);
    res.status(201).json({
      success: true,
      data: verb,
    });
  } catch (error) {
    console.error('添加动词错误:', error);
    res.status(500).json({
      success: false,
      error: '添加动词失败',
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = deleteVerb(id);
    if (!success) {
      res.status(404).json({
        success: false,
        error: '动词不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除动词错误:', error);
    res.status(500).json({
      success: false,
      error: '删除动词失败',
    });
  }
}

export async function hide(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = hideVerb(id);
    if (!success) {
      res.status(404).json({
        success: false,
        error: '动词不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '已标记为不再出现',
    });
  } catch (error) {
    console.error('隐藏动词错误:', error);
    res.status(500).json({
      success: false,
      error: '隐藏动词失败',
    });
  }
}
