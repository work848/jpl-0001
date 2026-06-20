import type { Request, Response } from 'express';
import { conjugateAdjective } from '../services/adjectiveConjugation.js';
import {
  getAllAdjectives,
  addAdjective,
  deleteAdjective,
  hideAdjective,
} from '../services/dataStore.js';
import {
  AdjectiveConjugateRequest,
  AdjectiveConjugateResponse,
  AdjectiveFormType,
} from '../../shared/types.js';

const ALL_ADJECTIVE_FORMS: AdjectiveFormType[] = ['past', 'baForm', 'nominalization'];

export async function conjugate(req: Request, res: Response) {
  try {
    const { word, type }: AdjectiveConjugateRequest = req.body;

    if (!word || !type) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数：word、type',
      });
      return;
    }

    const results = conjugateAdjective(word, type, ALL_ADJECTIVE_FORMS);

    const response: AdjectiveConjugateResponse = {
      word,
      type,
      results,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('形容词变形错误:', error);
    res.status(500).json({
      success: false,
      error: '形容词变形失败',
    });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const adjectives = getAllAdjectives();
    res.status(200).json({
      success: true,
      data: adjectives,
    });
  } catch (error) {
    console.error('获取形容词列表错误:', error);
    res.status(500).json({
      success: false,
      error: '获取形容词列表失败',
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

    const adjective = addAdjective(word, type);
    res.status(201).json({
      success: true,
      data: adjective,
    });
  } catch (error) {
    console.error('添加形容词错误:', error);
    res.status(500).json({
      success: false,
      error: '添加形容词失败',
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = deleteAdjective(id);
    if (!success) {
      res.status(404).json({
        success: false,
        error: '形容词不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除形容词错误:', error);
    res.status(500).json({
      success: false,
      error: '删除形容词失败',
    });
  }
}

export async function hide(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = hideAdjective(id);
    if (!success) {
      res.status(404).json({
        success: false,
        error: '形容词不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '已标记为不再出现',
    });
  } catch (error) {
    console.error('隐藏形容词错误:', error);
    res.status(500).json({
      success: false,
      error: '隐藏形容词失败',
    });
  }
}
