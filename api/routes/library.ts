import express from 'express';
import * as libraryController from '../controllers/libraryController.js';

const router = express.Router();

router.post('/import', libraryController.batchImport);
router.get('/', libraryController.listAll);
router.get('/nouns', libraryController.listNouns);
router.patch('/noun/:id/hide', libraryController.hideNounById);

export default router;
