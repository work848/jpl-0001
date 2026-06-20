import type { Request, Response } from 'express';
import {
  batchImportWords,
  getAllVerbs,
  getAllAdjectives,
  getAllNouns,
  hideNoun,
} from '../services/dataStore.js';
import { BatchImportResult, LibraryItem } from '../../shared/types.js';

export async function batchImport(req: Request, res: Response) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        success: false,
        error: '缺少必要参数：text',
      });
      return;
    }

    const result: BatchImportResult = batchImportWords(text);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('批量导入错误:', error);
    res.status(500).json({
      success: false,
      error: '批量导入失败',
    });
  }
}

export async function listAll(req: Request, res: Response) {
  try {
    const verbs = getAllVerbs();
    const adjectives = getAllAdjectives();
    const nouns = getAllNouns();

    const allItems: LibraryItem[] = [...verbs, ...adjectives, ...nouns];

    res.status(200).json({
      success: true,
      data: {
        verbs,
        adjectives,
        nouns,
        all: allItems,
      },
    });
  } catch (error) {
    console.error('获取词库列表错误:', error);
    res.status(500).json({
      success: false,
      error: '获取词库列表失败',
    });
  }
}

export async function listNouns(req: Request, res: Response) {
  try {
    const nouns = getAllNouns();
    res.status(200).json({
      success: true,
      data: nouns,
    });
  } catch (error) {
    console.error('获取名词列表错误:', error);
    res.status(500).json({
      success: false,
      error: '获取名词列表失败',
    });
  }
}

export async function hideNounById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = hideNoun(id);
    if (!success) {
      res.status(404).json({
        success: false,
        error: '名词不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '已标记为不再出现',
    });
  } catch (error) {
    console.error('隐藏名词错误:', error);
    res.status(500).json({
      success: false,
      error: '隐藏名词失败',
    });
  }
}
